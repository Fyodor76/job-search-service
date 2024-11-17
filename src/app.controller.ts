import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
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
  async getHello(@Req() req: any, @Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).json({ test: 'Test start app!!!' });
    } catch (e) {
      console.log(e, 'error');
    }
  }

  @Get('test')
  async test(@Req() req: any, @Res() res: Response) {
    console.log('123');
    res.cookie('test', 'test', {
      httpOnly: false, // Защищает от XSS
      secure: false, // Только через HTTPS в продакшн
    });
    return res.status(HttpStatus.OK).json({ test: 'test123' });
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
