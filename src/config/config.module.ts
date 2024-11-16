// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppConfigService } from './app.config';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_SECRET_REFRESH: Joi.string().required(),

        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
        YANDEX_CLIENT_ID: Joi.string().required(),
        YANDEX_CLIENT_SECRET: Joi.string().required(),
        YANDEX_CALLBACK_URL: Joi.string().uri().required(),

        REDIS_LOCAL_URL: Joi.string().required(),
        REDIS_PROD_URL: Joi.string().required(),

        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().default(587),
        SMTP_USER: Joi.string().email().required(),
        SMTP_PASS: Joi.string().required(),
        DEFAULT_FROM: Joi.string().default('"No Reply" <noreply@example.com>'),

        NODE_ENV: Joi.string().valid('development', 'production').required(),
        APP_PORT: Joi.number().default(8080),
        PROD_URL: Joi.string().uri().required(),
        LOCAL_URL: Joi.string().uri().required(),
        LOCAL_HOST: Joi.string().default('localhost'),
        PROD_HOST: Joi.string().required(),

        NEXT_PROD_URL: Joi.string().uri().required(),
        NEXT_LOCAL_URL: Joi.string().uri().required(),

        BOT_TOKEN: Joi.string().required(),
        BOT_TOKEN_TEST: Joi.string().required(),
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ConfigModule {}
