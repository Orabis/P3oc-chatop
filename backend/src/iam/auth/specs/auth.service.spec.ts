import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service.js';
import { UsersService } from '../../users/users.service.js';
import { CredentialsService } from '../../credentials/credentials.service.js';

describe('AuthService', () => {
  const user = { id: 1, email: 'john@example.com', password: 'hashed' };
  let service: AuthService;
  let usersService: {
    findOneByEmail: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  let credentialsService: {
    hashPassword: ReturnType<typeof vi.fn>;
    checkPassword: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    usersService = {
      findOneByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(user),
    };
    credentialsService = {
      hashPassword: vi.fn().mockResolvedValue('hashed'),
      checkPassword: vi.fn().mockResolvedValue(true),
    };
    service = new AuthService(
      usersService as unknown as UsersService,
      new JwtService({ secret: 'test-secret' }),
      credentialsService as unknown as CredentialsService,
    );
  });

  it('registers a user with a hashed password and returns a token', async () => {
    const result = await service.registerUser({
      name: 'John',
      email: user.email,
      password: 'Password123',
    });

    expect(usersService.create).toHaveBeenCalledWith({
      name: 'John',
      email: user.email,
      password: 'hashed',
    });
    expect(result.token).toEqual(expect.any(String));
  });

  it('refuses to register an email already in use', async () => {
    usersService.findOneByEmail.mockResolvedValue(user);

    await expect(
      service.registerUser({ name: 'J', email: user.email, password: 'x' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('validates a user without exposing the password', async () => {
    usersService.findOneByEmail.mockResolvedValue(user);

    await expect(
      service.validateUser({ email: user.email, password: 'Password123' }),
    ).resolves.toEqual({ id: 1, email: user.email });
  });

  it('rejects a wrong password', async () => {
    usersService.findOneByEmail.mockResolvedValue(user);
    credentialsService.checkPassword.mockResolvedValue(false);

    await expect(
      service.validateUser({ email: user.email, password: 'wrong' }),
    ).resolves.toBeNull();
  });
});
