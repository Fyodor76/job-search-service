// src/auth/strategies/yandex.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-yandex';
import { AppConfigService } from 'src/config/app.config';
import { YandexProfileDTO } from '../dto/YandexUserDto';
@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private configService: AppConfigService) {
    super({
      clientID: configService.getYandexClientId(),
      clientSecret: configService.getYandexClientSecret(),
      callbackURL: configService.getYandexCallbackUrl(),
      scope: ['login:email', 'login:info'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user: YandexProfileDTO = YandexProfileDTO.fromProfile(profile);
    console.log(user, 'user un yandex strategy');
    done(null, user);
  }
}
