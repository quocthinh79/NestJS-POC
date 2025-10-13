import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { User } from './entities/users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UserService);
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', username: 'Alice' },
        { id: '2', username: 'Bob' },
      ] as User[];

      service.findAll.mockResolvedValue(mockUsers);

      const result = await controller.getUsers();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('createUser', () => {
    it('should create a user when validation passes', async () => {
      const mockUser = {
        id: '1',
        username: 'Alice',
        email: 'a@test.com',
        name: 'Alice Josn Smith',
        password: 'password',
      } as User;
      service.create.mockResolvedValue(mockUser);

      const result = await controller.createUser(mockUser);

      expect(service.create).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw error if validation fails', async () => {
      const invalidUser = { email: '' } as Partial<User>;

      await expect(controller.createUser(invalidUser)).rejects.toThrow('Validation failed');
    });
  });

  describe('handleGetProfile', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: '1', username: 'Alice' } as User;
      service.findById.mockResolvedValue(mockUser);

      const result = await controller.handleGetProfile({ userId: '1' });

      expect(service.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });
  });
});
