import { RegisterUserDto } from '../dto/register-user.dto';

export class RegisterUserCommand {
  constructor(public readonly registerUserDto: RegisterUserDto) {}
}
