import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  @Get()
  @ApiExcludeEndpoint()
  getHello(@Req() req: Request, @Res() res: Response): string {
    res.cookie('test', 'test');
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
