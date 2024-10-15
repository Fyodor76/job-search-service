import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../users/user.entity';

@Table({ tableName: 'tokens' })
export class Token extends Model<Token> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number; // Идентификатор токена

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number; // Внешний ключ на пользователя

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken: string; // Refresh-токен

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deviceInfo: string; // Информация об устройстве (User-Agent, IP или другие данные)

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiresAt: Date; // Дата истечения refresh-токена (опционально)
}
