import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

import { MovesService } from '../services/moves.service';
import { CreateMoveDTO } from '../dtos/moves.dto';

@Controller('moves')
@UseGuards(JwtAuthGuard)
export class MovesController {
  constructor(private readonly movesService: MovesService) {}

  @Post()
  create(@Req() request: Request, @Body() data: CreateMoveDTO) {
    return this.movesService.create(data, request.user as User);
  }
}
