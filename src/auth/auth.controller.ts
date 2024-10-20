import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { getDeviceInfo } from 'src/helpers/device-info.helper';
import { GoogleProfile } from 'src/types/profile';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const deviceInfo = getDeviceInfo(req);
    const tokens = await this.authService.login(email, password, deviceInfo);
  }

  // Эндпоинт для начала аутентификации с Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Пустой метод, так как перенаправление идет через Google Guard
  }

  // Обработка перенаправления от Google
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const deviceInfo = getDeviceInfo(req);
    const tokens = await this.authService.googleLogin(
      req.user as GoogleProfile,
      deviceInfo,
    );

    // Устанавливаем refreshToken в cookies
    res.setRefreshToken(tokens.refreshToken);

    // Перенаправление на сайт после успешного входа
    res.redirect(`https://www.job-search-service.ru`);
  }

  // Эндпоинт для обновления токена
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    // Получаем refreshToken из куки
    const refreshToken = req.refreshToken;

    // Проверяем, если refreshToken отсутствует
    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Refresh token not provided.',
      });
    }

    // Получаем информацию об устройстве
    const userAgent = req.headers['user-agent']; // User-Agent браузера
    const ip = req.ip; // IP-адрес клиента

    // Вызываем метод обновления токенов и передаем данные об устройстве
    const tokens = await this.authService.refreshToken(
      refreshToken,
      userAgent || ip,
    );

    // Устанавливаем новый refreshToken в cookies
    res.setRefreshToken(tokens.refreshToken);

    return res.json(tokens); // Возвращаем новые токены клиенту
  }
}
