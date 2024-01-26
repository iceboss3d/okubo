import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/user/DTOs/create-user.dto';
import { LoginDTO } from './DTOs/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() data: CreateUserDTO) {
    return await this.authService.register(data);
  }

  @Post('/login')
  async login(@Body() data: LoginDTO) {
    return await this.authService.login(data);
  }
}
