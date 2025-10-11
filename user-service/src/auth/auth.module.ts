import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserHandler } from './commands/handlers/register-user.handler';
import { User } from 'src/users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LoginUserHandler } from './commands/handlers/login-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule, JwtModule.register({ secret: 'secret' })],
  providers: [RegisterUserHandler, LoginUserHandler],
  controllers: [AuthController],
  exports: [RegisterUserHandler, LoginUserHandler],
})
export class AuthModule {}
