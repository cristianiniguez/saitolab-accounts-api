import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/users/entities/user.entity';
import { CreateAccountDTO } from '../dtos/accounts.dto';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
  ) {}

  findAll(user: User) {
    return this.accountModel.find({ user: user._id }).exec();
  }

  async findOne(id: string, user: User) {
    const account = await this.accountModel
      .findOne({ _id: id, user: user._id })
      .exec();

    if (!account)
      throw new NotFoundException(`Account with id ${id} not found`);

    return account;
  }

  create(data: CreateAccountDTO, user: User) {
    const newAccount = new this.accountModel({ ...data, user: user._id });
    return newAccount.save();
  }
}
