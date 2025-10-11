import { Controller, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './users.entity';
import { UserService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CommandBus } from '@nestjs/cqrs';
import { Roles } from 'src/permissions/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/permissions/guards/permission.guard';
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Roles('admin')
  async deleteUser(@Param('id') id: string, @Request() req) {
    const requester = req.user; // contains role and userId
    return this.commandBus.execute(new DeleteUserCommand(+id, requester));
  }
}
