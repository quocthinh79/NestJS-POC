import { Controller, Post, Body } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  private userService: ClientProxy;

  constructor() {
    this.userService = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'users-service', port: 4001 },
    });
  }

  @Post('register')
  async register(@Body() body: { email: string; username: string; password: string }) {
    return this.userService.send({ cmd: 'register' }, body).toPromise();
  }
}
