import { Table, Column, Model, DataType, Unique } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number; // Идентификатор пользователя

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string; // Email пользователя

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string; // Пароль пользователя

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  googleId: string; // Google ID (если пользователь аутентифицирован через Google)
}
