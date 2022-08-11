import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

import { Move } from '../entities/move.entity';
import { Account } from '../entities/account.entity';
import { CreateMoveDTO, UpdateMoveDTO } from '../dtos/moves.dto';
import { AccountsService } from './accounts.service';

@Injectable()
export class MovesService {
  constructor(
    @InjectRepository(Move) private readonly moveRepo: Repository<Move>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    private readonly accountsService: AccountsService,
  ) {}

  async findOne(id: number, user: User) {
    const move = await this.moveRepo.findOne({
      where: { id },
      relations: ['account'],
    });

    // the move should exist
    if (!move) throw new NotFoundException(`Move with id ${id} not found`);

    // the move should belong to an account that belongs to the user
    const account = await this.accountRepo.findOne({
      where: { id: move.account.id, user: { id: user.id } },
    });
    if (!account) throw new NotFoundException(`Move with id ${id} not found`);

    return move;
  }

  async create(data: CreateMoveDTO, user: User) {
    const { account, ...rest } = data;
    const savedAccount = await this.accountsService.findOne(account, user);

    const newMove = this.moveRepo.create(rest);
    newMove.account = savedAccount;

    return this.moveRepo.save(newMove);
  }

  async update(id: number, data: UpdateMoveDTO, user: User) {
    const { account, ...rest } = data;
    const move = await this.findOne(id, user);

    if (account) {
      const savedAccount = await this.accountsService.findOne(account, user);
      move.account = savedAccount;
    }

    this.moveRepo.merge(move, rest);
    return this.moveRepo.save(move);
  }

  async remove(id: number, user: User) {
    const move = await this.findOne(id, user);
    return this.moveRepo.delete(move.id);
  }
}
