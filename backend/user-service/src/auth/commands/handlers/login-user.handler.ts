import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserCommand } from '../login-user.command';
import { User } from 'src/common/entities/users.entity';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginUserCommand) {
    const { email, password } = command.loginUserDto;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user)
      throw new RpcException({
        errorMessage: 'User not found',
        status: 404,
        errorCode: 'USER_NOT_FOUND',
      });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      throw new RpcException({
        errorMessage: 'Wrong password',
        status: 401,
        errorCode: 'INVALID_CREDENTIALS',
      });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token, id: user.id, email: user.email, role: user.role };
  }
}
