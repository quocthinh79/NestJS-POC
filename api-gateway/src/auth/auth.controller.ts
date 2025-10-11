import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject('USERS_SERVICE') private readonly userClient: ClientProxy) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const result$ = this.userClient.send({ cmd: 'register-user' }, dto);
    return await firstValueFrom(result$);
  }
}
