import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/users.entity';
import { AuthController } from './auth.controller';
import { LoginUserHandler } from './commands/handlers/login-user.handler';
import { LoginUserCommand } from './commands/login-user.command';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterUserHandler } from './commands/handlers/register-user.handler';

describe('AuthController', () => {
  let controller: AuthController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should register user', async () => {
    const dto = { email: 'test@mail.com', username: 'test', password: '123456' };
    jest.spyOn(commandBus, 'execute').mockResolvedValue({ id: 1, ...dto });

    const result = await controller.registerUser(dto);
    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should login user', async () => {
    const dto = { email: 'test@mail.com', password: '123456' };
    const expected = { access_token: 'jwt-token', user: { id: 1, email: dto.email } };
    jest.spyOn(commandBus, 'execute').mockResolvedValue(expected);

    const result = await controller.loginUser(dto);
    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});

describe('LoginUserHandler', () => {
  let handler: LoginUserHandler;
  let userRepo: any;
  let jwtService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUserHandler,
        { provide: getRepositoryToken(User), useValue: { findOne: jest.fn() } },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
      ],
    }).compile();

    handler = module.get(LoginUserHandler);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  it('should return token for valid credentials', async () => {
    const dto = { email: 'test@mail.com', password: '123456' };
    const user = { id: '1', email: dto.email, password: await bcrypt.hash(dto.password, 10) };

    userRepo.findOne.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jwtService.signAsync.mockResolvedValue('fake-token');

    const result = await handler.execute(new LoginUserCommand(dto));

    expect(result).toEqual({
      access_token: 'fake-token',
      user: { id: user.id, email: user.email },
    });
  });

  it('should throw for invalid credentials', async () => {
    userRepo.findOne.mockResolvedValue(null);
    await expect(
      handler.execute(new LoginUserCommand({ email: 'no@mail.com', password: 'x' })),
    ).rejects.toThrow('Invalid credentials');
  });
});

describe('AuthController - register', () => {
  let controller: AuthController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should call CommandBus.execute with RegisterUserCommand', async () => {
    const dto: RegisterUserDto = { email: 'test@mail.com', username: 'test', password: '123456' };
    const mockResponse = { id: '1', email: dto.email, username: dto.username };
    jest.spyOn(commandBus, 'execute').mockResolvedValue(mockResponse);

    const result = await controller.registerUser(dto);

    expect(commandBus.execute).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('should throw if CommandBus.execute fails', async () => {
    const dto: RegisterUserDto = {
      email: 'test111@mail.com',
      username: 'test',
      password: '123456',
    };
    jest.spyOn(commandBus, 'execute').mockRejectedValue(new Error('Email already registered'));

    await expect(controller.registerUser(dto)).rejects.toThrow('Email already registered');
  });
});

describe('RegisterUserHandler', () => {
  let handler: RegisterUserHandler;
  let userRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserHandler,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn(), create: jest.fn(), save: jest.fn() },
        },
      ],
    }).compile();

    handler = module.get(RegisterUserHandler);
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should create a new user', async () => {
    const dto = { email: 'test@mail.com', username: 'test', password: '123456' };
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = { id: '1', ...dto, password: hashedPassword };

    userRepo.findOne.mockResolvedValue(null);
    userRepo.create.mockReturnValue(user);
    userRepo.save.mockResolvedValue(user);

    const result = await handler.execute({ registerUserDto: dto });

    expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
    expect(userRepo.create).toHaveBeenCalled();
    expect(userRepo.save).toHaveBeenCalledWith(user);
    expect(result).toEqual({ id: '1', email: dto.email, username: dto.username });
  });

  it('should throw if email already exists', async () => {
    const dto = { email: 'test@mail.com', username: 'test', password: '123456' };
    const existingUser = { id: '1', ...dto };

    userRepo.findOne.mockResolvedValue(existingUser);

    await expect(handler.execute({ registerUserDto: dto })).rejects.toThrow(
      'Email already registered',
    );
  });
});
