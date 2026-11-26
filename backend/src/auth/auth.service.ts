import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';
import { DbService } from '../db/db.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  tokenVersion: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private dbService: DbService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Проверяем, существует ли активный пользователь с таким email
    const existingUser = await this.dbService.user.findFirst({
      where: {
        email,
        isActive: true,
      },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хешируем пароль
    const hashedPassword = await hash(password, 10);

    // Создаем пользователя
    const user = await this.dbService.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: USER_SELECT,
    });

    // Сразу выпускаем токены, без повторного запроса в БД и проверки bcrypt
    const tokens = this.generateTokens(user.id, user.email, user.tokenVersion);

    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.dbService.user.findUnique({
      where: { email },
    });

    // Timing-safe: если пользователь не найден, всё равно выполняем bcrypt,
    // чтобы время ответа не выдавало, зарегистрирован ли email.
    const passwordHash = user?.password ?? DUMMY_HASH;
    const isPasswordValid = await compare(password, passwordHash);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Деактивированный пользователь не может войти
    if (!user.isActive) {
      throw new UnauthorizedException('Аккаунт деактивирован');
    }

    const tokens = this.generateTokens(user.id, user.email, user.tokenVersion);

    const { password: _password, ...userWithoutPassword } = user;
    void _password;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  generateTokens(userId: number, email: string, tokenVersion: number) {
    const payload = { sub: userId, email, ver: tokenVersion };

    // Access токен на 1 минуту
    const accessToken = this.jwtService.sign(
      { ...payload, type: 'access' },
      {
        expiresIn: '1m',
      },
    );

    // Refresh токен на 24 часа
    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        expiresIn: '24h',
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          this.configService.get<string>('JWT_SECRET') ||
          'your-secret-key',
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(userId: number) {
    const user = await this.validateUser(userId);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const tokens = this.generateTokens(user.id, user.email, user.tokenVersion);

    return {
      user,
      ...tokens,
    };
  }

  /**
   * Отзывает все выданные refresh-токены пользователя, увеличивая tokenVersion.
   * Старые токены (с меньшим ver) перестают проходить валидацию.
   */
  async revokeRefreshTokens(userId: number): Promise<void> {
    await this.dbService.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });
  }

  /**
   * Отзывает refresh-токены по самому токену (для logout без guard).
   * Подпись проверяется, но срок действия игнорируется — logout должен работать
   * даже после истечения access-токена.
   */
  async revokeByRefreshToken(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = this.jwtService.verify<{ sub?: number }>(refreshToken, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          this.configService.get<string>('JWT_SECRET') ||
          'your-secret-key',
        ignoreExpiration: true,
      });

      if (payload?.sub) {
        await this.revokeRefreshTokens(payload.sub);
      }
    } catch {
      // Невалидный токен — отзывать нечего.
    }
  }

  async validateUser(userId: number): Promise<UserEntity | null> {
    const user = await this.dbService.user.findUnique({
      where: { id: userId },
      select: USER_SELECT,
    });

    // Проверяем, что пользователь активен
    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }
}

// Хеш от случайной строки — используется для выравнивания времени ответа,
// когда пользователь с таким email не найден.
const DUMMY_HASH =
  '$2b$10$wQO3nWfFzgFt71P9KQJw.OgkKcv0pYO81qrNi2tTODTk6ToZT452S';
