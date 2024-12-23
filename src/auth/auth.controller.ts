import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { getDeviceInfo } from 'src/helpers/device-info.helper';
import { ProfileType } from 'src/types/profile';
import { MailService } from 'src/mail/mail.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthSwaggerDocs } from 'src/swaggerApi/auth.swagger';
import { YandexProfileDTO } from './dto/YandexUserDto';
import { AppConfigService } from 'src/config/app.config';
import { RefreshVerificationException } from 'src/common/exceptions/refresh-verification.exception';
import { JwtAuthGuard } from 'src/guards/JwtAuthGuard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Post('send-otp')
  @AuthSwaggerDocs.sendOtp()
  async sendOtp(@Body('email') email: string, @Res() res: Response) {
    const otp = await this.authService.sendOtp(email);
    await this.mailService.sendOtp(email, otp);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'OTP sent to your email' });
  }

  @Post('verify-otp')
  @AuthSwaggerDocs.verifyOtp()
  async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('chatId') chatId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const deviceInfo = getDeviceInfo(req);
    let tokens;

    if (chatId) {
      tokens = await this.authService.verifyOtpByTelegram(
        chatId,
        otp,
        deviceInfo,
      );
    } else {
      tokens = await this.authService.verifyOtpByEmail(email, otp, deviceInfo);
    }

    res.setRefreshToken(tokens.refreshToken);
    res.setAccessToken(tokens.accessToken);

    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'User created', tokens });
  }

  @Get('yandex')
  @AuthSwaggerDocs.yandexAuth()
  @UseGuards(AuthGuard('yandex'))
  yandexAuth() {}

  @Get('yandex/callback')
  @AuthSwaggerDocs.yandexAuthRedirect()
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const deviceInfo = getDeviceInfo(req);
    const tokens = await this.authService.yandexLogin(
      req.user as YandexProfileDTO,
      deviceInfo,
    );
    res.setRefreshToken(tokens.refreshToken);
    res.setAccessToken(tokens.accessToken);
    setImmediate(() => {
      const urlRedirect = this.appConfigService.getBaseUrl();
      res.redirect(urlRedirect);
    });
  }

  @Get('google')
  @AuthSwaggerDocs.googleAuth()
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const deviceInfo = getDeviceInfo(req);
    const tokens = await this.authService.googleLogin(
      req.user as ProfileType,
      deviceInfo,
    );

    res.setRefreshToken(tokens.refreshToken);
    res.setAccessToken(tokens.accessToken);

    setImmediate(() => {
      const urlRedirect = this.appConfigService.getBaseUrl();
      res.redirect(urlRedirect);
    });
  }

  @Post('refresh-token')
  @AuthSwaggerDocs.refreshToken()
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.refreshToken;

      if (!refreshToken) {
        throw new RefreshVerificationException();
      }

      const deviceInfo = getDeviceInfo(req);
      const ip = req.ip;

      // Получаем новые токены
      const tokens = await this.authService.refreshToken(
        refreshToken,
        deviceInfo || ip,
      );

      // Устанавливаем новые куки
      res.setRefreshToken(tokens.refreshToken);
      res.setAccessToken(tokens.accessToken);

      // Возвращаем успешный ответ с токенами
      return res.status(HttpStatus.OK).json(tokens);
    } catch (error) {
      console.error('Ошибка при обновлении токенов:', error);

      if (error instanceof RefreshVerificationException) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid refresh token' });
      }

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to refresh tokens' });
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res() res: Response) {
    const userId = req.user.userId;
    const deviceInfo = getDeviceInfo(req);
    const cookieObject = this.appConfigService.getCookie();

    await this.authService.logout(userId, deviceInfo);

    res.clearCookie('accessToken', cookieObject);
    res.clearCookie('refreshToken', cookieObject);

    return res.status(HttpStatus.OK).json({ message: 'Logout successfully' });
  }
}
