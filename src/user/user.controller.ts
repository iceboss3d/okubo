import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserIdDTO } from './DTOs/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':user_id')
  async getUser(@Param() data: UserIdDTO) {
    return await this.userService.getUserById(data);
  }
}
