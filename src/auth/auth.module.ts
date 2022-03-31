import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { BasicStrategy } from './strategies/basic.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';

import { UsersModule } from 'src/users/users.module';
import config from 'src/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '10d' },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthService, BasicStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
