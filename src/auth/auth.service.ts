import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';
import { UsersService } from '../users/users.service';
import { TokensService } from './tokens.service';
import { GoogleProfile } from 'src/types/profile';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

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

    // Генерация токенов
    const tokens = this.jwtTokenService.generateTokens({
      sub: user.id,
      username: user.email,
    });

    // Проверяем наличие токена с тем же deviceInfo
    const existingToken = await this.tokensService.findByUserIdAndDeviceInfo(
      user.id,
      deviceInfo,
    );

    if (existingToken) {
      // Если токен с таким deviceInfo уже существует, обновляем его
      await this.tokensService.updateRefreshToken(existingToken, {
        refreshToken: tokens.refreshToken,
      });
    } else {
      // Если такого токена нет, создаем новый
      await this.tokensService.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        deviceInfo,
      );
    }

    return { accessToken: tokens.accessToken, userId: user.id };
  }

  async refreshToken(refreshToken: string, deviceInfo: string) {
    const tokenEntry =
      await this.tokensService.findByRefreshToken(refreshToken);
    if (!tokenEntry) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const payload = this.jwtTokenService.validateToken(refreshToken, 'refresh');
    if (!payload) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const tokens = this.jwtTokenService.generateTokens({
      sub: user.id,
      username: user.email,
    });

    // Обновление refresh-токена в базе для конкретного устройства
    await this.tokensService.saveRefreshToken(
      user.id,
      tokens.refreshToken,
      deviceInfo, // Обновляем информацию об устройстве
    );

    return tokens;
  }

  async login(email: string, password: string, deviceInfo: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Проверка пароля
    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Генерация токенов
    const tokens = this.jwtTokenService.generateTokens({
      sub: user.id,
      username: user.email,
    });

    // Сохраняем refresh токен и информацию об устройстве
    await this.tokensService.saveRefreshToken(
      user.id,
      tokens.refreshToken,
      deviceInfo,
    );

    return { accessToken: tokens.accessToken, userId: user.id };
  }
}
