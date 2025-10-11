import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private readonly userClient: ClientProxy) {}

  @Get()
  async getAllUsers() {
    const result$ = this.userClient.send('get_users', {});
    return await firstValueFrom(result$);
  }

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    const result$ = this.userClient.send('create_user', data);
    return await firstValueFrom(result$);
  }
}
