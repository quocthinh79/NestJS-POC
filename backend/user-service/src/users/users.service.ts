import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findById(id: string) {
    return this.userRepo.findOne({ where: { id } });
  }

  async getUsers(data: { page?: number; limit?: number; search?: string }): Promise<{
    data: User[];
    paging: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const page = Math.max(1, data.page ?? 1);
    const limit = Math.max(1, Math.min(100, data.limit ?? 10));
    const qb = this.userRepo.createQueryBuilder('user');

    if (data.search) {
      qb.where('user.name LIKE :q OR user.email LIKE :q', { q: `%${data.search}%` });
    }

    qb.orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data: items, paging: { total, page, limit, totalPages } };
  }
}
