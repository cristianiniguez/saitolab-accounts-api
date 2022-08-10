import { Module, ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { getEnvFileName } from './environments';
import { DatabaseModule } from './database/database.module';
import { TestModule } from './test/test.module';
import config from './config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';

const NormalModules: ModuleMetadata['imports'] = [
  ConfigModule.forRoot({
    envFilePath: getEnvFileName(),
    isGlobal: true,
    load: [config],
    validationSchema: Joi.object({
      DATABASE_URL: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
    }),
  }),
  DatabaseModule,
  UsersModule,
  AuthModule,
  AccountsModule,
];

const TestModules: ModuleMetadata['imports'] = [TestModule];

@Module({
  imports:
    process.env.NODE_ENV === 'test'
      ? [...NormalModules, ...TestModules]
      : NormalModules,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
