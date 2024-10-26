import { HttpException, HttpStatus } from '@nestjs/common';

export class OtpVerificationException extends HttpException {
  constructor() {
    super('Invalid OTP', HttpStatus.UNAUTHORIZED);
  }
}
