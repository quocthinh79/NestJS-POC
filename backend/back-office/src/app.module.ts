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
import { CountryInfo } from './common/entities/country-info.entity';
import { AffiliateInfo } from './common/entities/affiliate-info.entity';
import { StoreInfo } from './common/entities/store-info.entity';
import { UserStore } from './common/entities/user-store.entity';
import { AdminModule } from './admin/admin.module';

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
      entities: [User, Post, CountryInfo, AffiliateInfo, StoreInfo, UserStore],
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: true,
    }),
    UserModule,
    CqrsModule,
    AuthModule,
    PostModule,
    AdminModule,
  ],
  controllers: [UsersController],
  providers: [Repository<User>, Repository<Post>],
})
export class AppModule {}
