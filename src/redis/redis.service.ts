import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  // Установка значения с TTL
  async set(key: string, value: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.redisClient.set(key, value, 'EX', ttl);
      if (result !== 'OK') {
        console.error(
          `Failed to set key "${key}" in Redis. Expected "OK", got "${result}".`,
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Redis error while setting key "${key}":`, error);
      throw new InternalServerErrorException(
        `Failed to set key "${key}" in Redis.`,
      );
    }
  }

  // Получение значения по ключу
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redisClient.get(key);
      if (value === null) {
        console.warn(`Key "${key}" not found in Redis.`);
      }
      return value;
    } catch (error) {
      console.error(`Redis error while getting key "${key}":`, error);
      throw new InternalServerErrorException(
        `Failed to get key "${key}" from Redis.`,
      );
    }
  }

  // Удаление значения по ключу
  async del(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.del(key);
      if (result === 0) {
        console.warn(`Key "${key}" not found for deletion in Redis.`);
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Redis error while deleting key "${key}":`, error);
      throw new InternalServerErrorException(
        `Failed to delete key "${key}" in Redis.`,
      );
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length === 0) {
        console.warn(`No keys found matching pattern "${pattern}" in Redis.`);
      }
      return keys;
    } catch (error) {
      console.error(
        `Redis error while fetching keys with pattern "${pattern}":`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to fetch keys with pattern "${pattern}" from Redis.`,
      );
    }
  }

  // Хэширование данных (например, для deviceInfo)
  hash(value: string): string {
    try {
      return crypto.createHash('sha256').update(value).digest('hex');
    } catch (error) {
      console.error(`Error while hashing value "${value}":`, error);
      throw new InternalServerErrorException('Failed to hash value.');
    }
  }
}
