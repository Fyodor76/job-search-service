// src/auth/dto/google-profile.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class GoogleProfileDTO {
  @IsString()
  email: string; // Основной email

  @IsString()
  googleId: string; // Уникальный ID пользователя в Google

  @IsString()
  displayName: string; // Полное имя

  @IsOptional()
  @IsString()
  avatar?: string; // Аватар, если он есть

  // Статический метод для создания экземпляра из объекта profile
  static fromProfile(profile: any): GoogleProfileDTO {
    return {
      email: profile.emails[0].value, // Основной email
      googleId: profile.id, // Уникальный ID пользователя в Google
      displayName: profile.displayName, // Полное имя
      avatar: profile.photos[0]?.value, // Аватар, если он есть
    };
  }
}
