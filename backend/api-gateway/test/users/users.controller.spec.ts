import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, of } from 'rxjs';
import { UsersController } from '../../src/users/users.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let userClient: ClientProxy;

  beforeEach(async () => {
    const mockUserClient = {
      send: jest.fn().mockReturnValue(of({ id: '1', username: 'John Doe' })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'USERS_SERVICE',
          useValue: mockUserClient,
        },
      ],
    })
      // Disable guards for unit test simplicity
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(OwnershipGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    userClient = module.get<ClientProxy>('USERS_SERVICE');
  });

  it('should call userClient.send() with correct arguments', async () => {
    const mockUser = { id: '1', username: 'John Doe' };

    const result$ = await controller.getSpecificUserProfile('1', mockUser);

    expect(userClient.send).toHaveBeenCalledWith('get_user_profile', { userId: '1' });

    const result = await firstValueFrom(result$);
    expect(result).toEqual({ id: '1', username: 'John Doe' });
  });
});

describe('OwnershipGuard', () => {
  it('should allow access to owner', () => {
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { id: '1' }, params: { id: '1' } }),
      }),
    };
    const guard = new OwnershipGuard();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access to non-owner', () => {
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { id: '2' }, params: { id: '1' } }),
      }),
    };
    const guard = new OwnershipGuard();
    expect(() => guard.canActivate(context)).toThrowError('You can only access your own profile.');
  });
});
