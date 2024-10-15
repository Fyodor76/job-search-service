import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT || 8080;
  await app.listen(port);
  console.log(process.env.NODE_ENV);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
