import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class TokensService {
  private readonly tokenExpiry = 60 * 60 * 24 * 60; // 60 дней

  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  // Сохранение refresh токена в Redis
  async saveRefreshToken(
    userId: number,
    refreshToken: string,
    deviceInfo: string,
  ): Promise<void> {
    const hashedDeviceInfo = this.hashDeviceInfo(deviceInfo);
    const redisKey = this.getRedisKey(userId, hashedDeviceInfo);
    console.log(redisKey, 'redisKey');
    // Найдем старый refreshToken для этого устройства
    const oldRefreshToken = await this.redisClient.get(redisKey);

    // Если старый токен существует, удаляем его из хранилища refreshTokens
    if (oldRefreshToken) {
      await this.redisClient.del(`refreshTokens:${oldRefreshToken}`);
    }

    // Сохраняем новый токен по ключу, связанному с userId и deviceInfo
    await this.redisClient.set(redisKey, refreshToken, 'EX', this.tokenExpiry);

    // Также сохраняем refreshToken как ключ для быстрого поиска
    await this.redisClient.set(
      `refreshTokens:${refreshToken}`,
      JSON.stringify({ userId, deviceInfo: hashedDeviceInfo }),
      'EX',
      this.tokenExpiry,
    );
  }

  // Поиск refresh токена по ключу (userId и deviceInfo)
  async findByUserIdAndDeviceInfo(
    userId: number,
    deviceInfo: string,
  ): Promise<string | null> {
    const redisKey = this.getRedisKey(userId, deviceInfo);
    return this.redisClient.get(redisKey);
  }

  // Поиск по самому refresh токену
  async findByRefreshToken(
    refreshToken: string,
  ): Promise<{ userId: number; deviceInfo: string } | null> {
    const result = await this.redisClient.get(`refreshTokens:${refreshToken}`);
    if (result) {
      return JSON.parse(result); // Возвращаем userId и deviceInfo
    }
    return null;
  }

  // Удаление токенов для конкретного пользователя и устройства
  async deleteTokensByUserIdAndDevice(
    userId: number,
    deviceInfo: string,
  ): Promise<void> {
    const redisKey = this.getRedisKey(userId, deviceInfo);
    const refreshToken = await this.redisClient.get(redisKey);
    if (refreshToken) {
      // Удаляем также запись по refreshToken
      await this.redisClient.del(`refreshTokens:${refreshToken}`);
    }
    await this.redisClient.del(redisKey);
  }

  // Удаление всех refresh токенов для пользователя
  async deleteTokensByUserId(userId: number): Promise<void> {
    const keys = await this.redisClient.keys(`tokens:${userId}:*`);
    if (keys.length) {
      for (const key of keys) {
        const refreshToken = await this.redisClient.get(key);
        if (refreshToken) {
          // Удаляем записи по refreshToken
          await this.redisClient.del(`refreshTokens:${refreshToken}`);
        }
      }
      await this.redisClient.del(...keys);
    }
  }

  // Получение уникального ключа для хранения данных в Redis
  private getRedisKey(userId: number, deviceInfo: string): string {
    const hashedDeviceInfo = this.hashDeviceInfo(deviceInfo);
    return `tokens:${userId}:${hashedDeviceInfo}`;
  }

  // Хэширование deviceInfo для более коротких ключей
  private hashDeviceInfo(deviceInfo: string): string {
    return crypto.createHash('sha256').update(deviceInfo).digest('hex');
  }
}
