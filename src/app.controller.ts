import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis'; // Правильный импорт Redis

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRedis() private readonly redisClient: Redis, // Инъекция Redis клиента
  ) {}

  @Get()
  getHello(): string {
    console.log('test123');
    return this.appService.getHello();
  }

  @Post('save') // Эндпоинт для сохранения данных в Redis
  async saveValue(
    @Body() body: { key: string; value: string },
  ): Promise<string> {
    const { key, value } = body;
    await this.redisClient.set(key, value); // Сохраняем значение в Redis
    return `Value saved: ${value}`;
  }
}
