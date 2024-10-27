import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Извлекаем refreshToken из cookies и сохраняем в req для дальнейшего использования
    const refreshToken = req.cookies['refreshToken'];
    req.refreshToken = refreshToken || null; // Устанавливаем в null, если токена нет

    // Добавляем метод для установки refreshToken в HttpOnly cookies
    res.setRefreshToken = (refreshToken: string) => {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 24 * 60 * 60 * 1000,
      });
    };

    next();
  }
}
