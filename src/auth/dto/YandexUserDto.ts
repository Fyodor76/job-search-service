import { IsString, IsOptional } from 'class-validator';

export class YandexProfileDTO {
  @IsString()
  email: string;
  @IsString()
  yandexId: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  static fromProfile(profile: any): YandexProfileDTO {
    return {
      email: profile.emails[0].value,
      yandexId: profile.id,
      displayName: profile.displayName,
      // avatar: profile?.photos[0]?.value || '', // Аватар, если он есть
      avatar: '',
    };
  }
}
