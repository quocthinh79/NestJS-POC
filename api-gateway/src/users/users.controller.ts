import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './users.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const userId = req.user.id;
    return this.userClient.send('get_user_profile', { userId });
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Get(':id/profile')
  async getSpecificUserProfile(@CurrentUser() req) {
    const userId = req?.id;
    return this.userClient.send('get_user_profile', { userId });
  }
}
