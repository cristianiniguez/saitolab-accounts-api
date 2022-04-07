import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateAccountDTO extends PartialType(CreateAccountDTO) {}
