import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64, nullable: false, type: 'varchar' })
  name: string;

  @ManyToOne(() => User)
  user: User;
}
