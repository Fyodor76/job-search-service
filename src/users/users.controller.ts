import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Эндпоинт для регистрации пользователя через email и пароль
  @Post('register')
  async createUser(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      // Проверяем, существует ли пользователь с таким email
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      // Создаем нового пользователя
      const user = await this.usersService.create(email, password);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
