import { MoveType } from '../models/move.model';

export class CreateMoveDTO {
  detail: string;
  amount: number;
  date: Date;
  type: MoveType;
  account: string;
}
