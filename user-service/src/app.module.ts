import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/users.entity';
import { UserModule } from './users/users.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
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
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
