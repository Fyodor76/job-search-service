import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TokensService {
  private readonly tokenExpiry = 60 * 60 * 24 * 60;
  constructor(private readonly redisService: RedisService) {}

  // Сохранение refresh токена в Redis
  async saveRefreshToken(
    userId: number,
    refreshToken: string,
    deviceInfo: string,
  ): Promise<void> {
    const hashedDeviceInfo = this.hashDeviceInfo(deviceInfo);
    const redisKey = this.getRedisKey(userId, hashedDeviceInfo);

    // Найдем старый refreshToken для этого устройства
    const oldRefreshToken = await this.redisService.get(redisKey);

    // Если старый токен существует, удаляем его из хранилища refreshTokens
    if (oldRefreshToken) {
      await this.redisService.del(`refreshTokens:${oldRefreshToken}`);
    }

    // Сохраняем новый токен по ключу, связанному с userId и deviceInfo
    await this.redisService.set(redisKey, refreshToken, this.tokenExpiry);

    // Также сохраняем refreshToken как ключ для быстрого поиска
    await this.redisService.set(
      `refreshTokens:${refreshToken}`,
      JSON.stringify({ userId, deviceInfo: hashedDeviceInfo }),
      this.tokenExpiry,
    );
  }

  // Поиск refresh токена по ключу (userId и deviceInfo)
  async findByUserIdAndDeviceInfo(
    userId: number,
    deviceInfo: string,
  ): Promise<string | null> {
    const hashedDeviceInfo = this.hashDeviceInfo(deviceInfo);
    const redisKey = this.getRedisKey(userId, hashedDeviceInfo);
    return this.redisService.get(redisKey);
  }

  // Поиск по самому refresh токену
  async findByRefreshToken(
    refreshToken: string,
  ): Promise<{ userId: number; deviceInfo: string } | null> {
    const result = await this.redisService.get(`refreshTokens:${refreshToken}`);
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
    const hashedDeviceInfo = this.hashDeviceInfo(deviceInfo);
    const redisKey = this.getRedisKey(userId, hashedDeviceInfo);

    const refreshToken = await this.redisService.get(redisKey);

    if (refreshToken) {
      // Удаляем также запись по refreshToken
      await this.redisService.del(`refreshTokens:${refreshToken}`);
    }
    await this.redisService.del(redisKey);
  }

  // Удаление всех refresh токенов для пользователя
  async deleteTokensByUserId(userId: number): Promise<void> {
    const keys = await this.redisService.keys(`tokens:${userId}:*`);
    if (keys.length) {
      const deletePromises = keys.map(async (key) => {
        const refreshToken = await this.redisService.get(key);
        if (refreshToken) {
          // Удаляем записи по refreshToken
          await this.redisService.del(`refreshTokens:${refreshToken}`);
        }
        // Удаляем сам ключ
        await this.redisService.del(key);
      });

      // Ожидаем завершения всех операций удаления
      await Promise.all(deletePromises);
    }
  }
  // Получение уникального ключа для хранения данных в Redis
  private getRedisKey(userId: number, hashedDeviceInfo: string): string {
    return `tokens:${userId}:${hashedDeviceInfo}`;
  }

  // Хэширование deviceInfo для более коротких ключей
  private hashDeviceInfo(deviceInfo: string): string {
    return this.redisService.hash(deviceInfo);
  }
}
