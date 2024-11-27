import { HttpException, HttpStatus } from '@nestjs/common';

export class OtpVerificationException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid OTP',
        error: 'Unauthorized',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
