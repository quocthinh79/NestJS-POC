import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { CreateUserDto } from './dto/users.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private readonly userClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllUsers() {
    const result$ = this.userClient.send('get_users', {});
    return await firstValueFrom(result$);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createUser(@Body() data: CreateUserDto) {
    const result$ = this.userClient.send('create_user', data);
    return await firstValueFrom(result$);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getProfile(@Req() req) {
    const userId = req.user.id;
    return this.userClient.send('get_user_profile', { userId });
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @Get(':id/profile')
  @ApiOperation({ summary: 'Get specific user profile by ID' })
  @ApiResponse({ status: 200, description: 'Specific user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  async getSpecificUserProfile(@Param('id') id: string, @CurrentUser() req) {
    const userId = req?.id;
    return this.userClient.send('get_user_profile', { userId });
  }
}
