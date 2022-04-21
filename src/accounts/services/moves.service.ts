import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

import { Move } from '../entities/move.entity';
import { CreateMoveDTO } from '../dtos/moves.dto';
import { AccountsService } from './accounts.service';

@Injectable()
export class MovesService {
  constructor(
    @InjectRepository(Move) private readonly moveRepo: Repository<Move>,
    private readonly accountsService: AccountsService,
  ) {}

  async create(data: CreateMoveDTO, user: User) {
    const { account, ...rest } = data;
    const savedAccount = await this.accountsService.findOne(account, user);

    const newMove = this.moveRepo.create(rest);
    newMove.account = savedAccount;

    return this.moveRepo.save(newMove);
  }
}
