import { PartialType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { MoveType } from '../models/move.model';

export class CreateMoveDTO {
  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsIn([MoveType.INCOME, MoveType.OUTCOME])
  @IsNotEmpty()
  type: MoveType;

  @IsMongoId()
  @IsNotEmpty()
  account: string;
}

export class UpdateMoveDTO extends PartialType(CreateMoveDTO) {}
