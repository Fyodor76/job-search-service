import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello() {
    return 'Hello World and Hello everyone and How are youoooo!!! That is the finishing test for today day';
  }
}
