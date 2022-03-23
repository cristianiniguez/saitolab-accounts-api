import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { SignUpDTO } from '../dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() data: SignUpDTO) {
    this.authService.createUser(data);
  }
}
