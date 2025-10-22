import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(@Inject('MAIN_SERVICE') private readonly userClient: ClientProxy) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(@Body() dto: RegisterUserDto) {
    try {
      const result$ = this.userClient.send({ cmd: 'register-user' }, dto);
      return await firstValueFrom(result$);
    } catch (error) {
      throw new HttpException(error, error?.status);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successful login returns JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(@Body() dto: LoginUserDto) {
    try {
      const result$ = this.userClient.send({ cmd: 'login-user' }, dto);
      return await firstValueFrom(result$);
    } catch (error) {
      throw new HttpException(error, error?.status);
    }
  }
}
