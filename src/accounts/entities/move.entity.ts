import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { MoveType } from '../models/move.model';

@Entity()
export class Move {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, nullable: false, type: 'varchar' })
  detail: string;

  @Column({ nullable: false, type: 'decimal' })
  amount: number;

  @Column({ nullable: false, type: 'date' })
  date: Date;

  @Column({ length: 8, nullable: false, type: 'varchar' })
  type: MoveType;
}
