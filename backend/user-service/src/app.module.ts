import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './common/entities/users.entity';
import { UsersController } from './users/users.controller';
import { UserModule } from './users/users.module';
import { PostModule } from './posts/posts.module';
import { Repository } from 'typeorm';
import { Post } from './common/entities/Posts.entity';

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
      entities: [User, Post],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: false, // <— important
    }),
    UserModule,
    CqrsModule,
    AuthModule,
    PostModule,
    Repository,
  ],
  controllers: [UsersController],
  providers: [Repository<User>, Repository<Post>],
})
export class AppModule {}
