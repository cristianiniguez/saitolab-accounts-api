import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Move } from '../entities/move.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, nullable: false, type: 'varchar' })
  name: string;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Move, (move) => move.account)
  moves: Move[];
}
