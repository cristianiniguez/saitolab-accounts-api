import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { CreateAccountDTO, UpdateAccountDTO } from '../dtos/accounts.dto';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  findAll(user: User) {
    return this.accountRepo.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: number, user: User) {
    const account = await this.accountRepo.findOne({
      relations: ['moves'],
      where: { id, user: { id: user.id } },
    });

    if (!account)
      throw new NotFoundException(`Account with id ${id} not found`);

    return account;
  }

  create(data: CreateAccountDTO, user: User) {
    const newAccount = this.accountRepo.create(data);
    newAccount.user = user;
    return this.accountRepo.save(newAccount);
  }

  async update(id: number, data: UpdateAccountDTO, user: User) {
    const account = await this.findOne(id, user);
    this.accountRepo.merge(account, data);
    return this.accountRepo.save(account);
  }

  async remove(id: number, user: User) {
    const account = await this.findOne(id, user);
    return this.accountRepo.delete(account.id);
  }
}
