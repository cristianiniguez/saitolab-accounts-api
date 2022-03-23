import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/services/users.service';
import { SignUpDTO } from '../dtos/signup.dto';
import { Role } from '../models/role.model';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  createUser(data: SignUpDTO) {
    this.usersService.create({ ...data, role: Role.CLIENT });
  }
}
