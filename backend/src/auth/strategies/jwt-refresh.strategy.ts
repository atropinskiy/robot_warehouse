import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DbService } from '../../db/db.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private dbService: DbService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_REFRESH_SECRET') ||
        configService.get<string>('JWT_SECRET') ||
        'your-secret-key',
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    type: string;
    ver?: number;
  }) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Неверный тип токена');
    }

    const user = await this.dbService.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        tokenVersion: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Проверяем, что аккаунт активен
    if (!user.isActive) {
      throw new UnauthorizedException('Аккаунт деактивирован');
    }

    // Refresh-токен выпущен до последнего отзыва (logout) — считаем его недействительным
    if (payload.ver !== undefined && payload.ver !== user.tokenVersion) {
      throw new UnauthorizedException('Токен устарел');
    }

    return user;
  }
}
