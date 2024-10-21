import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { MailController } from './mail.controller'; // Импортируем новый контроллер

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'fydorzbinyakov@gmail.com', // ваш email
          pass: 'wqxcstlqaobfhxeb', // ваш App Password
        },
      },
      defaults: {
        from: '"No Reply" <fydorzbinyakov@gmail.com>',
      },
      template: {
        dir: './src/mail/templates', // Путь к вашим шаблонам писем
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  controllers: [MailController], // Добавляем контроллер в модуль
  exports: [MailService],
})
export class MailModule {}
