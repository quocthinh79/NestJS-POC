import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/common/entities/users.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', username: 'Alice' },
        { id: '2', username: 'Bob' },
      ] as User[];
      repo.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const mockData = { username: 'Alice', email: 'a@test.com' } as Partial<User>;
      const mockUser = { id: '1', ...mockData } as User;

      repo.create.mockReturnValue(mockUser);
      repo.save.mockResolvedValue(mockUser);

      const result = await service.create(mockData);

      expect(repo.create).toHaveBeenCalledWith(mockData);
      expect(repo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const mockUser = { id: '1', username: 'Alice' } as User;
      repo.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.findById('999');

      expect(result).toBeNull();
    });
  });
});
