import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ListUserCommand } from '../list-user.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/users.entity';
import { Repository } from 'typeorm';

@CommandHandler(ListUserCommand)
export class ListUserHandler implements ICommandHandler<ListUserCommand> {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async execute(command: ListUserCommand) {
    const { page, limit, search } = command;

    const currentPage = Math.max(1, page ?? 1);
    const finalLimit = Math.max(1, Math.min(100, limit ?? 10));
    const qb = this.userRepo.createQueryBuilder('user');

    if (search) {
      qb.where('user.name LIKE :q OR user.email LIKE :q', { q: `%${search}%` });
    }

    qb.orderBy('user.createdAt', 'DESC')
      .skip((currentPage - 1) * finalLimit)
      .take(finalLimit);

    const [items, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / finalLimit);

    return { data: items, paging: { total, page: currentPage, limit: finalLimit, totalPages } };
  }
}
