import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  controllers: [UsersController],
})
export class UsersModule {}
