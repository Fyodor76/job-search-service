import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { exec } from 'child_process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('test123');
    return this.appService.getHello();
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Body() body: any): any {
    console.log('Received webhook:', body);
    exec('git pull', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error output: ${stderr}`);
        return;
      }
      console.log(`Command output: ${stdout}`);
    });

    return 'hook has completed its work';
  }
}
