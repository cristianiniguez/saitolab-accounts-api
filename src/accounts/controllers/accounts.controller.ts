import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

import { AccountsService } from '../services/accounts.service';
import { CreateAccountDTO, UpdateAccountDTO } from '../dtos/accounts.dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(@Req() request: Request) {
    return this.accountsService.findAll(request.user as User);
  }

  @Get(':id')
  findOne(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOne(id, request.user as User);
  }

  @Post()
  create(@Req() request: Request, @Body() data: CreateAccountDTO) {
    return this.accountsService.create(data, request.user as User);
  }

  @Put(':id')
  update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAccountDTO,
  ) {
    return this.accountsService.update(id, data, request.user as User);
  }

  @Delete(':id')
  delete(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    return this.accountsService.remove(id, request.user as User);
  }
}
