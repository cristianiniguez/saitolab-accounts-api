import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestController } from './controllers/test.controller';
import { TestService } from './services/test.service';
import { User } from 'src/users/entities/user.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Move } from 'src/accounts/entities/move.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, Move])],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
