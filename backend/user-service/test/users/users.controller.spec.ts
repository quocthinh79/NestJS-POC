import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UserService } from '../../src/users/users.service';
import { User } from '../../src/common/entities/users.entity';
import { CommandBus } from '@nestjs/cqrs';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UserService>;
  let commandBus: jest.Mocked<CommandBus>;

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
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UserService);
    commandBus = module.get(CommandBus);
  });

  describe('getUsers', () => {
    it('should execute ListUserCommand', async () => {
      const mockResult = {
        data: [{ id: '1' }],
        paging: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };
      (commandBus.execute as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.getUsers({ page: 1, limit: 10 });

      expect(commandBus.execute).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('createUser', () => {
    it('should create a user when valid data is passed', async () => {
      const mockUser = { id: '1', email: 'a@test.com' } as Partial<User>;
      service.create.mockResolvedValue(mockUser as User);

      const result = await controller.createUser({ email: 'a@test.com' });

      expect(service.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
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
