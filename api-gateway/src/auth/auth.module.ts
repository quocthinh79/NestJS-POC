import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: { host: '0.0.0.0', port: 4001 },
      },
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
