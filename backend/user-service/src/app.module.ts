import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './common/entities/users.entity';
import { UsersController } from './users/users.controller';
import { UserModule } from './users/users.module';
import { PostModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'root',
      database: 'nestjs_db',
      autoLoadEntities: true,
      synchronize: true,
      entities: [User],
    }),
    UserModule,
    CqrsModule,
    AuthModule,
    PostModule,
  ],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
