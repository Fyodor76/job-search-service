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
    // todo
    return this.isDevelopment
      ? 'db'
      : this.configService.get<string>('DATABASE_HOST');
  }

  get databasePort(): number {
    return Number(this.configService.get<string>('DATABASE_PORT')) || 5432;
  }

  getCookie() {
    const isDevelopment = this.isDevelopment;
    const domain = this.configService.get<string>('COOKIE_DOMAIN');
    console.log(domain, 'domain ');
    return {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: 'lax' as const,
      domain: !isDevelopment ? domain : 'localhost',
    };
  }

  getBaseUrl(): string {
    return this.isDevelopment
      ? this.configService.get<string>('NEXT_LOCAL_URL')
      : this.configService.get<string>('NEXT_PROD_URL');
  }

  getIsDevelopment(): boolean {
    return this.isDevelopment;
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
    return `${baseUrl}/auth/google/callback`;
  }

  getGoogleClientId(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_ID');
  }

  getGoogleClientSecret(): string {
    return this.configService.get<string>('GOOGLE_CLIENT_SECRET');
  }

  getYandexCallbackUrl(): string {
    const baseUrl = this.isDevelopment
      ? this.configService.get<string>('LOCAL_URL')
      : this.configService.get<string>('PROD_URL');
    return `${baseUrl}/auth/yandex/callback`;
  }

  getYandexClientId(): string {
    return this.configService.get<string>('YANDEX_CLIENT_ID');
  }

  getYandexClientSecret(): string {
    return this.configService.get<string>('YANDEX_CLIENT_SECRET');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_SECRET_REFRESH');
  }

  getSmtpUser(): string {
    return this.configService.get<string>('SMTP_USER');
  }

  getSmtpPass(): string {
    return this.configService.get<string>('SMTP_PASS');
  }
}
