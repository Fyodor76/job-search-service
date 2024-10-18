import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/app.config';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService, // Измените на AppConfigService
  ) {}

  // Генерация access и refresh токенов
  generateTokens(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.appConfigService.getJwtSecret(), // Используйте метод из AppConfigService
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.appConfigService.getJwtRefreshSecret(), // Используйте метод из AppConfigService
        expiresIn: '60d',
      }),
    };
  }

  // Валидация токенов
  validateToken(token: string, type: 'access' | 'refresh') {
    const secret =
      type === 'access'
        ? this.appConfigService.getJwtSecret() // Используйте метод из AppConfigService
        : this.appConfigService.getJwtRefreshSecret(); // Используйте метод из AppConfigService

    try {
      return this.jwtService.verify(token, { secret });
    } catch {
      return null;
    }
  }
}
