import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT || 8080;
  await app.listen(port);
  console.log('Test of app');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
