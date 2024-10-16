// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { GoogleProfileDTO } from '../dto/googleUserDto';
import { AppConfigService } from 'src/config/app.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: AppConfigService) {
    super({
      clientID: configService.getGoogleClientId(),
      clientSecret: configService.getGoogleClientSecret(),
      callbackURL: configService.getGoogleCallbackUrl(),
      scope: ['email', 'profile'],
      accessType: 'offline',
      prompt: 'consent',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user: GoogleProfileDTO = GoogleProfileDTO.fromProfile(profile);
    done(null, user);
  }
}
