// src/swaggerApi/mail.swagger.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

export const MailSwaggerDocs = {
  sendOtp() {
    return applyDecorators(
      ApiOperation({ summary: 'Отправить OTP на email' }),
      ApiBody({
        schema: {
          example: { email: 'user@example.com', otp: '123456' },
        },
        description: 'Email и OTP для отправки на почту пользователя',
      }),
      ApiResponse({
        status: 200,
        description: 'OTP успешно отправлен на email',
        schema: {
          example: { message: 'OTP sent to user@example.com' },
        },
      }),
    );
  },
};
