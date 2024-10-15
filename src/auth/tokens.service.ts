import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token)
    private readonly tokenModel: typeof Token,
  ) {}

  // Сохранение или обновление refresh-токена в базе данных
  async saveRefreshToken(
    userId: number,
    refreshToken: string,
    deviceInfo: string, // Информация об устройстве
  ): Promise<void> {
    await this.tokenModel.upsert({
      userId,
      refreshToken,
      deviceInfo,
    });
  }

  // Поиск токена по refresh-токену
  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    return this.tokenModel.findOne({ where: { refreshToken } });
  }

  // Удаление токенов для конкретного пользователя и устройства
  async deleteTokensByUserIdAndDevice(
    userId: number,
    deviceInfo: string,
  ): Promise<void> {
    await this.tokenModel.destroy({ where: { userId, deviceInfo } });
  }

  // Удаление всех refresh-токенов для конкретного пользователя (например, при logout со всех устройств)
  async deleteTokensByUserId(userId: number): Promise<void> {
    await this.tokenModel.destroy({ where: { userId } });
  }

  async updateRefreshToken(
    token: Token,
    updateData: Partial<Token>,
  ): Promise<Token> {
    Object.assign(token, updateData);
    return await token.save();
  }

  async findByUserIdAndDeviceInfo(userId: number, deviceInfo: string) {
    return await this.tokenModel.findOne({
      where: { userId, deviceInfo },
    });
  }
}
