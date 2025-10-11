import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { PermissionModule } from 'src/permissions/permission.module';
import { DeleteUserHandler } from './commands/handlers/delete-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule, PermissionModule],
  providers: [UserService, DeleteUserHandler],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModule {}
