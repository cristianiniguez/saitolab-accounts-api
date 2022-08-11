import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { removePassword } from 'src/utils/user';

import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(data: CreateUserDTO) {
    // email has to be unique
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) throw new BadRequestException('Email is already in use');

    const newUser = this.userRepo.create(data);

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;

    const savedUser = await this.userRepo.save(newUser);
    return removePassword(savedUser);
  }
}
