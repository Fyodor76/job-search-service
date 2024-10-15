import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Генерация access и refresh токенов
  generateTokens(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET_REFRESH'),
        expiresIn: '7d',
      }),
    };
  }

  // Валидация токенов
  validateToken(token: string, type: 'access' | 'refresh') {
    const secret =
      type === 'access'
        ? this.configService.get('JWT_SECRET')
        : this.configService.get('JWT_SECRET_REFRESH');

    try {
      return this.jwtService.verify(token, { secret });
    } catch {
      return null;
    }
  }
}
