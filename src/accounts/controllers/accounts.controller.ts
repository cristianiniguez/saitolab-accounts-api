import { Body, Controller, Post } from '@nestjs/common';

import { CreateAccountDTO } from '../dtos/accounts.dto';

@Controller('accounts')
export class AccountsController {
  @Post()
  create(@Body() data: CreateAccountDTO) {
    return data;
  }
}
