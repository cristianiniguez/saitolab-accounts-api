import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './services/auth.service';
import { BasicStrategy } from './strategies/basic.strategy';
import { AuthController } from './controllers/auth.controller';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PassportModule, UsersModule],
  providers: [AuthService, BasicStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
