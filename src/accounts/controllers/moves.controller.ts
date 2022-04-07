import { Body, Controller, Post } from '@nestjs/common';

import { CreateMoveDTO } from '../dtos/moves.dto';

@Controller('moves')
export class MovesController {
  @Post()
  create(@Body() data: CreateMoveDTO) {
    return data;
  }
}
