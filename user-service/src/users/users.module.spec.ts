import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserModule } from './users.module';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

describe('UserModule', () => {
  let module: TestingModule;
  let controller: UsersController;
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    module = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockRepo)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should compile the module properly', () => {
    expect(module).toBeDefined();
    expect(controller).toBeInstanceOf(UsersController);
    expect(service).toBeInstanceOf(UserService);
  });

  it('should call repository when finding all users', async () => {
    const mockUsers = [{ id: '1', username: 'Alice' }];
    repo.find.mockResolvedValue(mockUsers as any);

    const result = await service.findAll();

    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });
});
