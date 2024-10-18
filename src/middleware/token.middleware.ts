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
        httpOnly: true, // Токен доступен только на сервере
        secure: true, // Только через HTTPS
        sameSite: 'strict', // Защита от CSRF-атак
        maxAge: 60 * 24 * 60 * 60 * 1000, // Время жизни 7 дней
      });
    };

    next();
  }
}
