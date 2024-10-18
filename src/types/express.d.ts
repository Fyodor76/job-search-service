import { Response, Request } from 'express';

declare global {
  namespace Express {
    interface Response {
      setRefreshToken(refreshToken: string): void; // Метод для установки cookies
    }

    interface Request {
      refreshToken?: string; // Свойство для хранения refreshToken
    }
  }
}
