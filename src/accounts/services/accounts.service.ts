import { Injectable } from '@nestjs/common';
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

  create(data: CreateAccountDTO, user: User) {
    const newAccount = new this.accountModel({ ...data, user: user._id });
    return newAccount.save();
  }
}
