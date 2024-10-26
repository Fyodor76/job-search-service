import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service'; // Импорт вашего MailService
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
    await this.mailService.sendOtp(email, otp); // Используем MailService для отправки письма
    return { message: `OTP sent to ${email}` }; // Возвращаем сообщение об успешной отправке
  }
}
