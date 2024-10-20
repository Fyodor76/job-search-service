import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/app.config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    ConfigModule,
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        type: 'single',
        url: configService.redisUrl,
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService], // Экспортируем RedisService
})
export class RedisModule {}
