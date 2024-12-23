import { IsString, IsOptional } from 'class-validator';

export class GoogleProfileDTO {
  @IsString()
  email: string;

  @IsString()
  googleId: string;

  @IsString()
  displayName: string;
  @IsOptional()
  @IsString()
  avatar?: string;

  static fromProfile(profile: any): GoogleProfileDTO {
    return {
      email: profile.emails[0].value,
      googleId: profile.id,
      displayName: profile.displayName,
      avatar: profile.photos[0]?.value,
    };
  }
}
