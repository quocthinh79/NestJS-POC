import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    PostsModule,
    UsersModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'MAIN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || '127.0.0.1',
          port: parseInt(process.env.USER_SERVICE_PORT || '4001', 10),
        },
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
