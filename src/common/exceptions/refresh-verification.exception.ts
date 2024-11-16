import { HttpException, HttpStatus } from '@nestjs/common';

export class RefreshVerificationException extends HttpException {
  constructor() {
    super('Refresh is invalid', HttpStatus.UNAUTHORIZED);
  }
}
