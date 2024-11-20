import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  // Установка значения с TTL
  async set(key: string, value: string, ttl: number): Promise<boolean> {
    const result = await this.redisClient.set(key, value, 'EX', ttl);
    return result === 'OK';
  }

  // Получение значения по ключу
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  // Удаление значения по ключу
  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  // Получение всех ключей по шаблону
  async keys(pattern: string): Promise<string[]> {
    return this.redisClient.keys(pattern);
  }

  // Хэширование данных (например, для deviceInfo)
  hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}
