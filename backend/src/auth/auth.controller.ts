import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GetUser } from './decorators/get-user.decorator';
import { UserEntity } from './entities/user.entity';

// Путь refresh-куки с учётом префикса nginx (/api → backend).
// Путь /api, а не /api/auth/refresh: иначе кука не уходит на /api/auth/logout,
// и logout не может отозвать refresh-токен (revokeByRefreshToken получает undefined).
const REFRESH_COOKIE_PATH = '/api';

@ApiTags('auth')
@ApiCookieAuth('access_token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description:
      'Пользователь создан, куки access_token и refresh_token установлены',
    type: UserEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные (валидация DTO)',
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(registerDto);

    this.setAuthCookies(res, result.access_token, result.refresh_token);

    return result.user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в аккаунт' })
  @ApiResponse({
    status: 200,
    description: 'Вход выполнен, куки access_token и refresh_token установлены',
    type: UserEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные (валидация DTO)',
  })
  @ApiResponse({
    status: 401,
    description: 'Неверный email или пароль / аккаунт деактивирован',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    this.setAuthCookies(res, result.access_token, result.refresh_token);

    return result.user;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Обновление пары токенов по refresh-куке' })
  @ApiResponse({
    status: 200,
    description: 'Токены обновлены, новые куки установлены',
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh-токен отсутствует, невалиден или устарел',
  })
  async refresh(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshTokens(user.id);

    this.setAuthCookies(res, result.access_token, result.refresh_token);

    return result.user;
  }

  // Guard снят: logout должен работать и после истечения access-токена,
  // чтобы можно было очистить куки и отозвать refresh-токен.
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Выход: очистка кук и отзыв refresh-токена' })
  @ApiResponse({ status: 200, description: 'Выход выполнен успешно' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.revokeByRefreshToken(req.cookies?.refresh_token);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: REFRESH_COOKIE_PATH });

    return { message: 'Выход выполнен успешно' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Текущий пользователь (требует access-куку)' })
  @ApiResponse({
    status: 200,
    description: 'Данные пользователя',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  getMe(@GetUser() user: UserEntity) {
    return user;
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 1000, // 1 минута
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: REFRESH_COOKIE_PATH,
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
    });
  }
}
