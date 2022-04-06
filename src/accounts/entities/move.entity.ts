import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { MoveType } from '../models/move.model';
import { Account } from './account.entity';

@Schema()
export class Move extends Document {
  @Prop({ required: true })
  detail: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  type: MoveType;

  @Prop({ ref: Account.name, required: true, type: Types.ObjectId })
  account: Account | Types.ObjectId;
}

export const MoveSchema = SchemaFactory.createForClass(Move);
