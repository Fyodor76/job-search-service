import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Определение статуса
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage = this.getErrorMessage(exception); // Получаем сообщение об ошибке

    // Логирование всех ошибок
    console.error('Error caught by AllExceptionsFilter:', {
      status,
      message: errorMessage,
      stack: exception instanceof Error ? exception.stack : 'No stack trace',
    });

    // Возвращаем клиенту информацию об ошибке
    response.status(status).json({
      statusCode: status,
      message: errorMessage, // Отправляем сообщение об ошибке на клиент
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }), // Условно добавляем стек ошибок в ответ в режиме разработки
    });
  }

  private getErrorMessage(exception: unknown): string {
    // Если исключение является экземпляром ошибки, возвращаем его сообщение
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string'
        ? response
        : (response as any).message || 'An error occurred';
    }

    if (exception instanceof Error) {
      return exception.message; // Возвращаем сообщение об ошибке
    }

    // В противном случае, возвращаем стандартное сообщение
    return 'An unknown error occurred';
  }
}
