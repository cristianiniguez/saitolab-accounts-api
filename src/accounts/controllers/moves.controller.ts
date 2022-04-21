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

import { MovesService } from '../services/moves.service';
import { CreateMoveDTO, UpdateMoveDTO } from '../dtos/moves.dto';

@Controller('moves')
@UseGuards(JwtAuthGuard)
export class MovesController {
  constructor(private readonly movesService: MovesService) {}

  @Get(':id')
  findOne(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    return this.movesService.findOne(id, request.user as User);
  }

  @Post()
  create(@Req() request: Request, @Body() data: CreateMoveDTO) {
    return this.movesService.create(data, request.user as User);
  }

  @Put(':id')
  update(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMoveDTO,
  ) {
    return this.movesService.update(id, data, request.user as User);
  }

  @Delete(':id')
  delete(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    return this.movesService.remove(id, request.user as User);
  }
}
