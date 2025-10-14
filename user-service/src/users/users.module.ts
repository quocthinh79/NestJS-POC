import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from '../common/entities/users.entity';
import { UserService } from './users.service';
import { DeleteUserHandler } from './commands/handlers/delete-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  providers: [UserService, DeleteUserHandler],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModule {}
