import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/services/users.service';
import { SignUpDTO } from '../dtos/signup.dto';
import { Role } from '../models/role.model';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  createUser(data: SignUpDTO) {
    this.usersService.create({ ...data, role: Role.CLIENT });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }
}
