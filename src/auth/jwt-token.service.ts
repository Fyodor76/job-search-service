import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/app.config';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  // Генерация access и refresh токенов
  generateTokens(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.appConfigService.getJwtSecret(),
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.appConfigService.getJwtRefreshSecret(),
        expiresIn: '60d',
      }),
    };
  }

  // Валидация токенов
  validateToken(token: string, type: 'access' | 'refresh') {
    const secret =
      type === 'access'
        ? this.appConfigService.getJwtSecret()
        : this.appConfigService.getJwtRefreshSecret();

    try {
      return this.jwtService.verify(token, { secret });
    } catch {
      return null;
    }
  }
}
