import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Move } from 'src/accounts/entities/move.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Move) private readonly moveRepo: Repository<Move>,
  ) {}

  async deleteUsers() {
    const users = await this.userRepo.find();
    return Promise.all(
      users.map((user) => this.userRepo.delete({ id: user.id })),
    );
  }

  async deleteAccounts() {
    const accounts = await this.accountRepo.find();
    return Promise.all(
      accounts.map((account) => this.accountRepo.delete({ id: account.id })),
    );
  }

  async deleteMoves() {
    const moves = await this.moveRepo.find();
    return Promise.all(
      moves.map((move) => this.moveRepo.delete({ id: move.id })),
    );
  }
}
