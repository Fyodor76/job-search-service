import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])], // Подключаем модель User
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Экспортируем UsersService, чтобы другие модули могли его использовать
})
export class UsersModule {}
