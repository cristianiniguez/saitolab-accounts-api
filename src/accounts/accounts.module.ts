import { Module } from '@nestjs/common';
import { AccountsController } from './controllers/accounts.controller';
import { MovesController } from './controllers/moves.controller';
import { AccountsService } from './services/accounts.service';
import { MovesService } from './services/moves.service';

@Module({
  controllers: [AccountsController, MovesController],
  providers: [AccountsService, MovesService]
})
export class AccountsModule {}
