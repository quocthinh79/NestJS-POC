import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from '../common/entities/users.entity';
import { UserService } from './users.service';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from './commands/delete-user.command';

@Controller()
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
  ) {}

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

  @MessagePattern('get_user_profile')
  async handleGetProfile(@Payload() data: { userId: string }) {
    return this.userService.findById(data.userId);
  }

  @MessagePattern('delete_user')
  async handleDeleteUser(@Payload() data: { userId: string }) {
    return this.commandBus.execute(new DeleteUserCommand(data.userId));
  }
}
