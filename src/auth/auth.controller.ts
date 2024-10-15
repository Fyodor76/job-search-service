import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
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
    const deviceInfo = getDeviceInfo(req); // Используем функцию из helper'а
    const tokens = await this.authService.login(email, password, deviceInfo);
    return res.status(HttpStatus.OK).json(tokens);
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
    res.redirect(`https://www.job-search-service.ru`);
  }

  // Эндпоинт для обновления токена
  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Получаем информацию об устройстве
    const userAgent = req.headers['user-agent']; // User-Agent браузера
    const ip = req.ip; // IP-адрес клиента

    // Вызываем метод обновления токенов и передаем данные об устройстве
    const tokens = await this.authService.refreshToken(
      refreshToken,
      userAgent || ip,
    );

    return res.json(tokens); // Возвращаем новые токены клиенту
  }
}
