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

@Module({
  imports: [
    ConfigModule, // Ensure this is imported
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        secret: appConfigService.getJwtSecret(),
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