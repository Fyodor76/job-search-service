import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailNotFoundException extends HttpException {
  constructor(email: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Email ${email} not found`,
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
