import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  @Get()
  @ApiExcludeEndpoint()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('save')
  @ApiExcludeEndpoint()
  async saveValue(
    @Body() body: { key: string; value: string },
  ): Promise<string> {
    const { key, value } = body;
    await this.redisClient.set(key, value);
    return `Value saved: ${value}`;
  }
}
