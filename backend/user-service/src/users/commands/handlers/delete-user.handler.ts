import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/users.entity';
import { Repository } from 'typeorm';
import { DeleteUserCommand } from '../delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async execute(command: DeleteUserCommand) {
    const { userId } = command;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    await this.userRepo.remove(user);

    return { message: `User with ID ${userId} has been deleted.` };
  }
}
