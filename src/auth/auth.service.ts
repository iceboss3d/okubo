import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/DTOs/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './DTOs/auth.dto';
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string =
    this.configService.getOrThrow('JWT_SECRET');
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: CreateUserDTO) {
    return await this.userService.createUser(data);
  }

  async login(data: LoginDTO) {
    const user = await this.userService.getUserByEmail({ email: data.email });

    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid Credentials');
    }

    const token = sign({ ...user.toResponseObject() }, this.JWT_SECRET, {
      expiresIn: '24h',
    });

    return {
      ...user.toResponseObject(),
      token,
    };
  }
}
