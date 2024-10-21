import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';
import { UsersService } from '../users/users.service';
import { TokensService } from './tokens.service';
import { GoogleProfile } from 'src/types/profile';
import { generateOtp } from 'src/helpers/generate-otp';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly redisService: RedisService, // Добавьте RedisService
  ) {}

  async sendOtp(email: string): Promise<string> {
    const otp = generateOtp(); // Генерация OTP
    await this.redisService.set(`otp:${email}`, otp, 60 * 10); // Сохранение OTP в Redis
    return otp; // Возвращаем OTP для отправки по почте
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const savedOtp = await this.redisService.get(`otp:${email}`); // Получаем OTP из Redis

    if (savedOtp !== otp) {
      throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
    }

    // Если OTP верен, сохраняем пользователя в базу данных
    const user = await this.usersService.create(email);
    return user; // Возвращаем созданного пользователя
  }

  async googleLogin(profile: GoogleProfile, deviceInfo: string) {
    // Ищем пользователя сначала по Google ID
    let user = await this.usersService.findByGoogleId(profile.googleId);

    if (!user) {
      // Если пользователь не найден по Google ID, проверяем по email
      user = await this.usersService.findByEmail(profile.email);

      if (user) {
        // Если пользователь найден по email, обновляем его Google ID
        await this.usersService.update(user, { googleId: profile.googleId });
      } else {
        // Если пользователя нет, создаем нового
        user = await this.usersService.createFromGoogleProfile(profile);
      }
    }

    // Генерация access и refresh токенов
    const tokens = this.jwtTokenService.generateTokens({
      sub: user.id,
      username: user.email,
    });

    await this.tokensService.saveRefreshToken(
      user.id,
      tokens.refreshToken,
      deviceInfo,
    );

    // Возвращаем access токен и ID пользователя
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
    };
  }

  async refreshToken(refreshToken: string, deviceInfo: string) {
    // Ищем refresh токен в Redis
    const tokenEntry =
      await this.tokensService.findByRefreshToken(refreshToken);
    if (!tokenEntry) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // Проверяем валидность токена
    const payload = this.jwtTokenService.validateToken(refreshToken, 'refresh');
    if (!payload) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    // Ищем пользователя по ID из payload
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // Генерируем новые access и refresh токены
    const tokens = this.jwtTokenService.generateTokens({
      sub: user.id,
      username: user.email,
    });

    // Обновляем refresh токен в Redis для данного пользователя и устройства
    await this.tokensService.saveRefreshToken(
      user.id,
      deviceInfo,
      tokens.refreshToken, // Обновляем с новым refresh токеном
    );

    // Возвращаем новые токены
    return tokens;
  }
}
