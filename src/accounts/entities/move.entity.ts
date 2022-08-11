import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Account } from './account.entity';
import { MoveType } from '../models/move.model';
import { DecimalTransformer } from '../../common/transformers/decimal.transformer';

@Entity()
export class Move {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, nullable: false, type: 'varchar' })
  detail: string;

  @Column({
    nullable: false,
    precision: 8,
    scale: 2,
    transformer: new DecimalTransformer(),
    type: 'decimal',
  })
  amount: number;

  @Column({ nullable: false, type: 'date' })
  date: Date;

  @Column({ length: 8, nullable: false, type: 'varchar' })
  type: MoveType;

  @ManyToOne(() => Account)
  account: Account;
}
