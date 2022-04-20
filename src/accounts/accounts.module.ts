import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsController } from './controllers/accounts.controller';
import { MovesController } from './controllers/moves.controller';
import { AccountsService } from './services/accounts.service';
import { MovesService } from './services/moves.service';
import { Account } from './entities/account.entity';
import { Move } from './entities/move.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Move])],
  controllers: [AccountsController, MovesController],
  providers: [AccountsService, MovesService],
})
export class AccountsModule {}
