export interface GoogleProfile {
  email: string; // Основной email
  googleId: string; // Уникальный ID пользователя в Google
  displayName: string; // Полное имя
  avatar?: string; // Аватар (необязательное поле)
}
