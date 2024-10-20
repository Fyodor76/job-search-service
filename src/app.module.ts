import { Module, MiddlewareConsumer } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigModule } from './config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {
  RedisModule,
  RedisModuleOptions,
  RedisSingleOptions,
} from '@nestjs-modules/ioredis';
import { AppConfigService } from './config/app.config';
import { TokenMiddleware } from './middleware/token.middleware';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: async (
        configService: AppConfigService,
      ): Promise<SequelizeModuleOptions> => {
        const sequelizeOptions: SequelizeModuleOptions = {
          dialect: 'postgres',
          host: configService.databaseHost,
          port: configService.databasePort,
          username: configService.getDatabaseUser(),
          password: configService.getDatabasePassword(),
          database: configService.getDatabaseName(),
          autoLoadModels: true,
          synchronize: true,
        };

        return sequelizeOptions;
      },
    }),
    RedisModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes('*');
  }
}
