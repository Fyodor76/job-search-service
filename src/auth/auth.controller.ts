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
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('send-otp')
  async sendOtp(@Body('email') email: string, @Res() res: Response) {
    const otp = await this.authService.sendOtp(email);
    await this.mailService.sendOtp(email, otp);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'OTP sent to your email' });
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.verifyOtp(email, otp); // Верификация OTP
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'User created', user });
    } catch (error) {
      return res.status(error.getStatus()).json({ message: error.message });
    }
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
