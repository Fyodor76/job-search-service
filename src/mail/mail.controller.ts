import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service'; // Импорт вашего MailService

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-otp')
  async sendOtp(
    @Body() body: { email: string; otp: string },
  ): Promise<{ message: string }> {
    const { email, otp } = body;
    await this.mailService.sendOtp(email, otp); // Используем MailService для отправки письма
    return { message: `OTP sent to ${email}` }; // Возвращаем сообщение об успешной отправке
  }
}
