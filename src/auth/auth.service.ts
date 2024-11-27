import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';
import { UsersService } from '../users/users.service';
import { TokensService } from './tokens.service';
import { ProfileType } from 'src/types/profile';
import { generateOtp } from 'src/helpers/generate-otp';
import { RedisService } from 'src/redis/redis.service';
import { OtpVerificationException } from 'src/common/exceptions/otp-verification.exception';
import { OtpGenerationException } from 'src/common/exceptions/otp-generation-exception';
import { RefreshVerificationException } from 'src/common/exceptions/refresh-verification.exception';
import { TokenValidationException } from 'src/common/exceptions/token-validation-exception';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found-exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly redisService: RedisService,
  ) {}

  async sendOtp(email: string): Promise<string> {
    try {
      const otp = generateOtp();
      const success = await this.redisService.set(`otp:${email}`, otp, 60 * 10);
      if (!success) throw new OtpGenerationException();
      return otp;
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new OtpGenerationException();
    }
  }

  async verifyOtpByTelegram(chatId: string, otp: string, deviceInfo: any) {
    try {
      console.log(otp, 'otp in service');
      const savedOtp = await this.redisService.get(`otp:${chatId}`);
      if (savedOtp !== otp) throw new OtpVerificationException();

      let user = await this.usersService.findByChatId(chatId);
      if (!user) user = await this.usersService.createByChatId(chatId);

      const tokens = this.jwtTokenService.generateTokens({
        sub: user.id,
        chatId: user.chatId,
      });

      await this.tokensService.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        deviceInfo,
      );

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: user.id,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new HttpException('Failed to verify OTP', HttpStatus.FORBIDDEN);
    }
  }

  async verifyOtpByEmail(email: string, otp: string, deviceInfo: any) {
    try {
      const savedOtp = await this.redisService.get(`otp:${email}`);
      if (savedOtp !== otp) throw new OtpVerificationException();

      let user = await this.usersService.findByEmail(email);
      if (!user) user = await this.usersService.createByEmail(email);

      const tokens = this.jwtTokenService.generateTokens({
        sub: user.id,
        email: user.email,
      });

      await this.tokensService.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        deviceInfo,
      );

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: user.id,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new HttpException(
            'Failed to verify OTP by email',
            HttpStatus.BAD_REQUEST,
          );
    }
  }

  async yandexLogin(profile: ProfileType, deviceInfo: string) {
    try {
      let user = await this.usersService.findByYandexId(profile.yandexId);

      if (!user) {
        user = await this.usersService.findByEmail(profile.email);

        if (user) {
          await this.usersService.update(user, { yandexId: profile.yandexId });
        } else {
          user = await this.usersService.createFromYandexProfile(profile);
        }
      }

      const tokens = this.jwtTokenService.generateTokens({
        sub: user.id,
        email: user.email,
      });

      await this.tokensService.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        deviceInfo,
      );

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: user.id,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new HttpException(
            'Failed to login with Yandex',
            HttpStatus.BAD_REQUEST,
          );
    }
  }

  async googleLogin(profile: ProfileType, deviceInfo: string) {
    try {
      let user = await this.usersService.findByGoogleId(profile.googleId);

      if (!user) {
        user = await this.usersService.findByEmail(profile.email);

        if (user) {
          await this.usersService.update(user, { googleId: profile.googleId });
        } else {
          user = await this.usersService.createFromGoogleProfile(profile);
        }
      }

      const tokens = this.jwtTokenService.generateTokens({
        sub: user.id,
        email: user.email,
      });

      await this.tokensService.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        deviceInfo,
      );

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: user.id,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new HttpException(
            'Failed to login with Google',
            HttpStatus.BAD_REQUEST,
          );
    }
  }

  async refreshToken(refreshToken: string, deviceInfo: string) {
    try {
      const tokenEntry =
        await this.tokensService.findByRefreshToken(refreshToken);

      if (!tokenEntry) throw new RefreshVerificationException();

      const payload = this.jwtTokenService.validateToken(
        refreshToken,
        'refresh',
      );
      if (!payload) throw new TokenValidationException();

      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UserNotFoundException();

      const tokens = this.jwtTokenService.generateTokens({
        sub: user.id,
        email: user.email,
      });

      await this.tokensService.saveRefreshToken(
        user.id,
        tokens.refreshToken,
        deviceInfo,
      );

      return tokens;
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new HttpException('Failed to refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  async logout(userId: number, deviceInfo: string) {
    try {
      await this.tokensService.deleteTokensByUserIdAndDevice(
        userId,
        deviceInfo,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to logout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
