// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { GoogleProfile } from 'src/types/profile';
import { GoogleProfileDTO } from '../dto/googleUserDto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:8080/auth/google/callback',
      scope: ['email', 'profile'],
      accessType: 'offline', // Обязательно для получения refresh token
      prompt: 'consent', // Запрашиваем согласие пользователя каждый раз для возврата refresh token
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    // Используем статический метод fromProfile для создания объекта DTO
    const user: GoogleProfileDTO = GoogleProfileDTO.fromProfile(profile);

    done(null, user); // Возвращаем данные пользователя в done
  }
}
