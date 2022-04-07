import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMoveDTO } from '../dtos/moves.dto';

@Controller('moves')
@UseGuards(JwtAuthGuard)
export class MovesController {
  @Post()
  create(@Req() request: Request, @Body() data: CreateMoveDTO) {
    console.log(request.user);
    return data;
  }
}
