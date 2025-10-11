import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from './entities/users.entity';
import { UserService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get_users')
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @MessagePattern('create_user')
  async createUser(data: Partial<User>) {
    const dto = plainToInstance(User, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new Error('Validation failed: ' + JSON.stringify(errors));
    }

    return this.userService.create(data);
  }
}
