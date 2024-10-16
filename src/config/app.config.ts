// src/config/app.config.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);

  constructor(private configService: ConfigService) {
    this.logger.log('AppConfigService был создан!');
  }

  get isDevelopment(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'development';
  }

  get redisUrl(): string {
    return this.isDevelopment
      ? this.configService.get<string>('REDIS_LOCAL_URL')
      : this.configService.get<string>('REDIS_PROD_URL');
  }

  get databaseHost(): string {
    return this.isDevelopment
      ? 'localhost'
      : this.configService.get<string>('DATABASE_HOST');
  }

  get databasePort(): number {
    return Number(this.configService.get<string>('DATABASE_PORT')) || 5432;
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('DATABASE_USER');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }

  getGoogleCallbackUrl(): string {
    const baseUrl = this.isDevelopment
      ? this.configService.get<string>('LOCAL_URL')
      : this.configService.get<string>('PROD_URL');

    return `${baseUrl}auth/google/callback`;
  }

  getGoogleClientId(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_ID');
  }

  getGoogleClientSecret(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_SECRET');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_SECRET_REFRESH');
  }
}
