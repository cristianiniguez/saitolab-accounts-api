import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/entities/user.entity';
import { removePassword } from 'src/utils/user';

import { SignUpDTO } from '../dtos/signup.dto';
import { Payload } from '../models/payload.model';
import { Role } from '../models/role.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  createUser(data: SignUpDTO) {
    return this.usersService.create({ ...data, role: Role.CLIENT });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return removePassword(user);
  }

  generateJWT(user: User) {
    const payload: Payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
