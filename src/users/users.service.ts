import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { ProfileType } from 'src/types/profile';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  // Создание нового пользователя
  async create(email: string): Promise<User> {
    const user = await this.userModel.create({ email });
    return user;
  }

  async update(user: User, updateData: Partial<User>): Promise<User> {
    Object.assign(user, updateData);
    return await user.save();
  }

  // Поиск пользователя по email
  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userModel.findByPk(id);
  }

  // Поиск пользователя по Google ID
  async findByGoogleId(googleId: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { googleId } });
  }

  // Поиск пользователя по Yandex ID
  async findByYandexId(yandexId: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { yandexId } });
  }

  // Создание пользователя из профиля Google
  async createFromGoogleProfile(profile: ProfileType): Promise<User> {
    return await this.userModel.create({ ...profile });
  }

  // Создание пользователя из профиля Yandex
  async createFromYandexProfile(profile: ProfileType): Promise<User> {
    return await this.userModel.create({ ...profile });
  }
}
