import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtTokenService } from './jwt-token.service'; // Импортируйте JwtTokenService
import { TokensService } from './tokens.service'; // Импортируйте TokensService
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AppConfigService } from 'src/config/app.config';
import { RedisModule } from 'src/redis/redis.module';
import { MailModule } from 'src/mail/mail.module';
import { YandexStrategy } from './strategies/yandex.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.getJwtSecret(),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    SequelizeModule.forFeature([Token]),
    RedisModule,
    UsersModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    YandexStrategy,
    JwtStrategy,
    JwtTokenService,
    TokensService,
    AuthService,
    AppConfigService,
  ],
})
export class AuthModule {}
