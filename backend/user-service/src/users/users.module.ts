import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities/users.entity';
import { DeleteUserHandler } from './commands/handlers/delete-user.handler';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { ListUserHandler } from './commands/handlers/list-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  providers: [UserService, DeleteUserHandler, ListUserHandler],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModule {}
