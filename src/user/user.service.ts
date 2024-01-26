import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './Entities/user.entity';
import { DataSource } from 'typeorm';
import { CreateUserDTO } from './DTOs/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserEmailDTO, UserIdDTO } from './DTOs/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async createUser(data: CreateUserDTO) {
    const user = this.dataSource.transaction(async (tx) => {
      const userRepository = tx.getRepository(User);
      const existingUser = await userRepository.findOne({
        where: {
          email: data.email,
        },
      });

      if (existingUser) {
        throw new ConflictException('User with such email already exists.');
      }

      const newUser = userRepository.create(data);
      newUser.password = await bcrypt.hash(data.password, 10);
      await userRepository.save(newUser);

      const extra = userRepository.create(data);
      newUser.password = await bcrypt.hash(data.password, 10);
      await userRepository.save(extra);

      return newUser.toResponseObject();
    });
    return user;
  }

  async getUserByEmail(userIdDto: UserEmailDTO) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        email: userIdDto.email,
      },
    });

    return user;
  }

  async getUserById(userEmailDTO: UserIdDTO) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        id: userEmailDTO.user_id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.toResponseObject();
  }
}
