import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppConfigService } from '../config/app.config';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private readonly appConfigService: AppConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies['refreshToken'];
    const accessToken = req.cookies['accessToken'];

    req.refreshToken = refreshToken || null;
    req.accessToken = accessToken || null;

    const isProduction = !this.appConfigService.getIsDevelopment();

    res.setRefreshToken = (refreshToken: string) => {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'none',
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });
    };

    res.setAccessToken = (accessToken: string) => {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'none',
        maxAge: 15 * 60 * 1000,
      });
    };

    next();
  }
}
