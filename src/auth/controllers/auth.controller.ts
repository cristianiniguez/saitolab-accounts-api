import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';

import { AuthService } from '../services/auth.service';
import { SignUpDTO } from '../dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() data: SignUpDTO) {
    this.authService.createUser(data);
  }

  @Post('sign-in')
  @UseGuards(AuthGuard('basic'))
  signIn(@Req() req: Request) {
    return this.authService.generateJWT(req.user as User);
  }
}
