import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessVerificationException } from 'src/common/exceptions/access-verification.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw err || new AccessVerificationException();
    }
    return user;
  }
}
