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
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  deviceInfo: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiresAt: Date;
}
