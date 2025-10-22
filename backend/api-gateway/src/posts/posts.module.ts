import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PostsController } from './posts.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAIN_SERVICE',
        transport: Transport.TCP,
        options: { host: '0.0.0.0', port: 4001 },
      },
    ]),
  ],
  controllers: [PostsController],
})
export class PostsModule {}
