import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailSwaggerDocs } from 'src/swaggerApi/mail.swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-otp')
  @MailSwaggerDocs.sendOtp()
  async sendOtp(
    @Body() body: { email: string; otp: string },
  ): Promise<{ message: string }> {
    const { email, otp } = body;
    await this.mailService.sendOtp(email, otp);
    return { message: `OTP sent to ${email}` };
  }
}
