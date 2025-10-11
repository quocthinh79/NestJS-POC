import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterDto } from './dto/register.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RegisterCommand } from './commands/register.command';

@Controller()
export class AuthMessageController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern({ cmd: 'register' })
  async handleRegister(@Payload() data: RegisterDto) {
    // manually validate DTO since microservices bypass pipes
    const dto = plainToInstance(RegisterDto, data);
    await validateOrReject(dto);

    return this.commandBus.execute(new RegisterCommand(dto.email, dto.username, dto.password));
  }
}
