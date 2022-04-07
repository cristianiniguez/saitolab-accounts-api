import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateAccountDTO } from '../dtos/accounts.dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  @Post()
  create(@Req() request: Request, @Body() data: CreateAccountDTO) {
    console.log(request.user);
    return data;
  }
}
