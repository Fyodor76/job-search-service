import { Response, Request } from 'express';

declare global {
  namespace Express {
    interface Response {
      setRefreshToken(refreshToken: string): void;
    }

    interface Request {
      refreshToken?: string;
    }
  }
}
