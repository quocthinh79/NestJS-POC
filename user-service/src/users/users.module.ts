import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { UserService } from './users.service';
import { RegisterUserHandler } from './commands/handlers/register-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  providers: [UserService, RegisterUserHandler],
  controllers: [UsersController],
  exports: [UserService, RegisterUserHandler],
})
export class UserModule {}
