import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../register-user.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as sgMail from '@sendgrid/mail';
import { User } from 'src/users/entities/users.entity';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async execute(command: RegisterUserCommand): Promise<Partial<User> | null> {
    const { email, username, password } = command.registerUserDto;

    const exists = await this.usersRepo.findOne({ where: { email } });
    if (exists) throw new Error('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, username, password: hashed });
    await this.usersRepo.save(user);
    console.log(`User registered: ${email}`);

    try {
      await sgMail.send({
        to: email,
        from: 'noreply@yourapp.com',
        subject: 'Welcome to Our App!',
        html: `<p>Hello ${username},</p>
             <p>Your account has been created. Please change your password soon.</p>`,
      });
    } catch (error) {
      console.error('Error sending email:', error);

      return { id: user.id, email: user.email, username: user.username };
    }

    return { id: user.id, email: user.email, username: user.username };
  }
}
