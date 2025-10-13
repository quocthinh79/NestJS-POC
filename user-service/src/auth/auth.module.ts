import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserHandler } from './commands/handlers/register-user.handler';
import { User } from 'src/users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LoginUserHandler } from './commands/handlers/login-user.handler';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],
  providers: [RegisterUserHandler, LoginUserHandler],
  controllers: [AuthController],
  exports: [RegisterUserHandler, LoginUserHandler, JwtModule],
})
export class AuthModule {}
