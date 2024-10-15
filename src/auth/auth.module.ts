import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtTokenService } from './jwt-token.service'; // Импортируйте JwtTokenService
import { TokensService } from './tokens.service'; // Импортируйте TokensService
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    SequelizeModule.forFeature([Token]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    JwtStrategy,
    JwtTokenService,
    TokensService,
    AuthService,
  ],
})
export class AuthModule {}
