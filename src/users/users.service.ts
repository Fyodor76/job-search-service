import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity'; // Импортируйте модель User
import { GoogleProfile } from 'src/types/profile';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  // Создание нового пользователя с хешированием пароля
  async create(email: string): Promise<User> {
    const user = await this.userModel.create({ email });
    return user;
  }

  async update(user: User, updateData: Partial<User>): Promise<User> {
    Object.assign(user, updateData); // Обновляем данные пользователя
    return await user.save(); // Сохраняем изменения
  }

  // Поиск пользователя по email
  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { email } });
  }

  // Поиск пользователя по Google ID
  async findByGoogleId(googleId: string): Promise<User | null> {
    console.log(googleId, 'googleId');
    return await this.userModel.findOne({ where: { googleId } });
  }

  // Поиск пользователя по ID
  async findById(id: number): Promise<User | null> {
    return await this.userModel.findByPk(id);
  }

  // Создание пользователя из профиля Google
  async createFromGoogleProfile(profile: GoogleProfile): Promise<User> {
    return await this.userModel.create({ ...profile });
  }
}
