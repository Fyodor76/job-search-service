import { Table, Column, Model, DataType, Unique } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  googleId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  yandexId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  chatId: string;
}
