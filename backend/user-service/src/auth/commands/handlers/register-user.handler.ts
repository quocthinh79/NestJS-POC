import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../register-user.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as sgMail from '@sendgrid/mail';
import { User } from 'src/common/entities/users.entity';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { APP_CONFIG } from 'src/constants/env';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {
    sgMail.setApiKey(APP_CONFIG.SENDGRID_API_KEY);
  }

  async execute(command: RegisterUserCommand): Promise<Partial<User> | null> {
    const { email, username, password } = command.registerUserDto;

    const exists = await this.usersRepo.findOne({ where: { email } });
    if (exists) {
      throw new RpcException({
        errorMessage: 'Email already registered',
        status: HttpStatus.CONFLICT,
        errorCode: 'EMAIL_ALREADY_REGISTERED',
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, username, password: hashed });
    await this.usersRepo.save(user);
    console.log(`User registered: ${email}`);

    sgMail
      .send({
        to: email,
        from: 'poc-node-js.sender@yopmail.com',
        subject: 'Welcome to Our App!',
        html: `<p>Hello <strong>${username}</strong>,</p>
             <p>Your account has been created. Please change your password soon.</p>`,
      })
      .catch(error => {
        throw new RpcException({
          errorMessage: 'Failed to send welcome email: ' + error.message,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: 'EMAIL_SEND_FAILED',
        });
      });

    return { id: user.id, email: user.email, username: user.username };
  }
}
