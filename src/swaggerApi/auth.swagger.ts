// src/swaggerApi/auth.swagger.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

export const AuthSwaggerDocs = {
  sendOtp() {
    return applyDecorators(
      ApiOperation({ summary: 'Отправить OTP на email' }),
      ApiBody({
        schema: { example: { email: 'user@example.com' } },
        description: 'Email пользователя',
      }),
      ApiResponse({ status: 200, description: 'OTP отправлен на email' }),
    );
  },

  verifyOtpByEmailOrChatId() {
    return applyDecorators(
      ApiOperation({ summary: 'Верификация OTP' }),
      ApiBody({
        schema: { example: { email: 'user@example.com', otp: '123456' } },
        description: 'Email и OTP пользователя',
      }),
      ApiResponse({ status: 201, description: 'Пользователь создан' }),
      ApiResponse({ status: 400, description: 'Неверный OTP' }),
    );
  },

  googleAuth() {
    return applyDecorators(
      ApiOperation({ summary: 'Аутентификация через Google' }),
      ApiResponse({ status: 302, description: 'Перенаправление на Google' }),
    );
  },

  googleAuthRedirect() {
    return applyDecorators(
      ApiOperation({ summary: 'Callback от Google после аутентификации' }),
      ApiResponse({
        status: 302,
        description: 'Перенаправление на сайт после успешной аутентификации',
      }),
    );
  },

  // Добавляем документацию для Yandex
  yandexAuth() {
    return applyDecorators(
      ApiOperation({ summary: 'Аутентификация через Yandex' }),
      ApiResponse({ status: 302, description: 'Перенаправление на Yandex' }),
    );
  },

  yandexAuthRedirect() {
    return applyDecorators(
      ApiOperation({ summary: 'Callback от Yandex после аутентификации' }),
      ApiResponse({
        status: 302,
        description: 'Перенаправление на сайт после успешной аутентификации',
      }),
    );
  },

  refreshToken() {
    return applyDecorators(
      ApiOperation({ summary: 'Обновление токенов' }),
      ApiResponse({ status: 200, description: 'Новые токены успешно созданы' }),
      ApiResponse({ status: 401, description: 'Отсутствует refresh токен' }),
    );
  },
};
