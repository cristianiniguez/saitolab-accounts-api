import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Account } from '../../accounts/entities/account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, nullable: false, type: 'varchar', unique: true })
  email: string;

  @Column({ length: 128, nullable: false, type: 'varchar' })
  password: string;

  @Column({ length: 32, nullable: false, type: 'varchar' })
  firstName: string;

  @Column({ length: 32, nullable: false, type: 'varchar' })
  lastName: string;

  @Column({ length: 8, nullable: false, type: 'varchar' })
  role: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}
