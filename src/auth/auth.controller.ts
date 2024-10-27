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
import { ProfileType } from 'src/types/profile';
import { MailService } from 'src/mail/mail.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthSwaggerDocs } from 'src/swaggerApi/auth.swagger';
import { OtpVerificationException } from 'src/common/exceptions/otp-verification.exception';
import { YandexProfileDTO } from './dto/YandexUserDto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('send-otp')
  @AuthSwaggerDocs.sendOtp()
  async sendOtp(@Body('email') email: string, @Res() res: Response) {
    console.log(email, 'email');
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
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const deviceInfo = getDeviceInfo(req);
    const tokens = await this.authService.verifyOtp(email, otp, deviceInfo);

    res.setRefreshToken(tokens.refreshToken);

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
    res.redirect(`https://www.job-search-service.ru`);
  }

  @Get('google')
  @AuthSwaggerDocs.googleAuth()
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @AuthSwaggerDocs.googleAuthRedirect()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const deviceInfo = getDeviceInfo(req);
    const tokens = await this.authService.googleLogin(
      req.user as ProfileType,
      deviceInfo,
    );
    res.setRefreshToken(tokens.refreshToken);
    res.redirect(`https://www.job-search-service.ru`);
  }

  @Post('refresh-token')
  @AuthSwaggerDocs.refreshToken()
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.refreshToken;

    if (!refreshToken) {
      throw new OtpVerificationException();
    }

    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const tokens = await this.authService.refreshToken(
      refreshToken,
      userAgent || ip,
    );
    res.setRefreshToken(tokens.refreshToken);
    return res.json(tokens);
  }
}
