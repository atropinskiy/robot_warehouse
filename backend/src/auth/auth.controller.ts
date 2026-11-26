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
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GetUser } from './decorators/get-user.decorator';
import { UserEntity } from './entities/user.entity';

// Путь refresh-эндпоинта с учётом префикса nginx (/api → backend).
// Ограничиваем refresh-куку только этим путём, чтобы она не уходила с каждым запросом.
const REFRESH_COOKIE_PATH = '/api/auth/refresh';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(registerDto);

    this.setAuthCookies(res, result.access_token, result.refresh_token);

    return {
      user: result.user,
      message: 'Регистрация успешна',
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    this.setAuthCookies(res, result.access_token, result.refresh_token);

    return {
      user: result.user,
      message: 'Вход выполнен успешно',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @GetUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshTokens(user.id);

    this.setAuthCookies(res, result.access_token, result.refresh_token);

    return {
      user: result.user,
      message: 'Токены обновлены',
    };
  }

  // Guard снят: logout должен работать и после истечения access-токена,
  // чтобы можно было очистить куки и отозвать refresh-токен.
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.revokeByRefreshToken(req.cookies?.refresh_token);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: REFRESH_COOKIE_PATH });

    return { message: 'Выход выполнен успешно' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
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
