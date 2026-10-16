import { NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service.js';
import { MessagesRepository } from './messages.repository.js';
import { RentalsService } from '../rentals/rentals.service.js';
import { UsersService } from '../iam/users/users.service.js';

describe('MessagesService', () => {
  const dto = { rental_id: 1, user_id: 2, message: 'Bonjour' };
  let service: MessagesService;
  let repository: { create: ReturnType<typeof vi.fn> };
  let rentalsService: { exists: ReturnType<typeof vi.fn> };
  let usersService: { exists: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    repository = { create: vi.fn() };
    rentalsService = { exists: vi.fn().mockResolvedValue(true) };
    usersService = { exists: vi.fn().mockResolvedValue(true) };
    service = new MessagesService(
      repository as unknown as MessagesRepository,
      rentalsService as unknown as RentalsService,
      usersService as unknown as UsersService,
    );
  });

  it('stores the message', async () => {
    await expect(service.create(dto)).resolves.toEqual({
      message: 'Message sent!',
    });
    expect(repository.create).toHaveBeenCalledWith(dto);
  });

  it('throws NotFoundException when the rental does not exist', async () => {
    rentalsService.exists.mockResolvedValue(false);

    await expect(service.create(dto)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when the user does not exist', async () => {
    usersService.exists.mockResolvedValue(false);

    await expect(service.create(dto)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
