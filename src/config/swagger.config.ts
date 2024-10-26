// src/config/swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Job Search Service API') // Название документации
    .setDescription('API description for the Job Search Service') // Описание API
    .setVersion('1.0')
    .addBearerAuth() // Добавление авторизации по токену
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
