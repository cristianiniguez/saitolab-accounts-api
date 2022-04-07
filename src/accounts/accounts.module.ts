import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountsController } from './controllers/accounts.controller';
import { MovesController } from './controllers/moves.controller';
import { AccountsService } from './services/accounts.service';
import { MovesService } from './services/moves.service';
import { Account, AccountSchema } from './entities/account.entity';
import { Move, MoveSchema } from './entities/move.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Move.name, schema: MoveSchema },
    ]),
  ],
  controllers: [AccountsController, MovesController],
  providers: [AccountsService, MovesService],
})
export class AccountsModule {}
