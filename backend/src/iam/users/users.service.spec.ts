import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';

describe('UsersService', () => {
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };
  let service: UsersService;
  let repository: { findById: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    repository = { findById: vi.fn().mockResolvedValue(user) };
    service = new UsersService(repository as unknown as UsersRepository);
  });

  it('returns the user without the password', async () => {
    const result = await service.findOneById(1);

    expect(result).toMatchObject({ id: 1, email: 'john@example.com' });
    expect(result).not.toHaveProperty('password');
  });

  it('throws NotFoundException when the user does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOneById(42)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
