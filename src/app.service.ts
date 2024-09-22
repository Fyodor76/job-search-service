import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World and Hello everyone and How are youoooo!!! Test!!!!';
  }
}
