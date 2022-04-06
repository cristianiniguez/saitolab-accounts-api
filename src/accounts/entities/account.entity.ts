import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from 'src/users/entities/user.entity';

@Schema()
export class Account extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ ref: User.name, required: true, type: Types.ObjectId })
  user: User | Types.ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
