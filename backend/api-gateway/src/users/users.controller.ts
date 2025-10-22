import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ExceptOwnershipGuard } from 'src/common/guards/except-ownership.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateUserDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject('MAIN_SERVICE') private readonly userClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllUsers() {
    try {
      const result$ = this.userClient.send('get_users', {});
      return await firstValueFrom(result$);
    } catch (error) {
      throw new HttpException(error, error?.status);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createUser(@Body() data: CreateUserDto) {
    try {
      const result$ = this.userClient.send('create_user', data);
      return await firstValueFrom(result$);
    } catch (error) {
      throw new HttpException(error, error?.status);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getProfile(@Req() req) {
    try {
      const userId = req.user.id;
      return this.userClient.send('get_user_profile', { userId });
    } catch (error) {
      throw new HttpException(error, error?.status);
    }
  }

  @UseGuards(JwtAuthGuard, OwnershipGuard)
  @ApiBearerAuth()
  @Get(':id/profile')
  @ApiOperation({ summary: 'Get specific user profile by ID' })
  @ApiResponse({ status: 200, description: 'Specific user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  async getSpecificUserProfile(@Param('id') id: string, @CurrentUser() req) {
    try {
      const userId = req?.id;
      return this.userClient.send('get_user_profile', { userId });
    } catch (error) {
      throw new HttpException(error, error?.status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard, ExceptOwnershipGuard)
  @ApiBearerAuth()
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const result$ = this.userClient.send('delete_user', { userId: id });
      return await firstValueFrom(result$);
    } catch (error) {
      throw new HttpException(error, error?.status);
    }
  }
}
