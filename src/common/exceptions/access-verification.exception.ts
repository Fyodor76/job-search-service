import { HttpException, HttpStatus } from '@nestjs/common';

export class AccessVerificationException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Access is invalid',
        error: 'Invalid Token',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
