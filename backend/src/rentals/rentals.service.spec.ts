import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { RentalsService } from './rentals.service.js';
import { RentalsRepository } from './rentals.repository.js';
import { RentalWithOwner } from './entities/rental.entity.js';

const rental: RentalWithOwner = {
  id: 1,
  name: 'Appartement Paris',
  surface: new Prisma.Decimal(50),
  price: new Prisma.Decimal(1200.5),
  picture: 'http://localhost:3001/uploads/a.png',
  description: 'Bel appartement',
  owner_id: 7,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
  owner: { id: 7, name: 'Patrick' },
};

const picture = { filename: 'b.png' } as Express.Multer.File;

describe('RentalsService', () => {
  let service: RentalsService;
  let repository: {
    findAll: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repository = {
      findAll: vi.fn().mockResolvedValue([rental]),
      findById: vi.fn().mockResolvedValue(rental),
      create: vi.fn(),
      update: vi.fn(),
    };
    const config = {
      get: (key: string, fallback?: string) =>
        key === 'APP_URL' ? 'http://api.test' : fallback,
    } as ConfigService;
    service = new RentalsService(
      repository as unknown as RentalsRepository,
      config,
    );
  });

  it('returns rentals wrapped in an object, with numbers and owner', async () => {
    const result = await service.findAll();

    expect(result.rentals).toHaveLength(1);
    expect(result.rentals[0]).toMatchObject({
      surface: 50,
      price: 1200.5,
      owner: { id: 7, name: 'Patrick' },
    });
    expect(result.rentals[0]).not.toHaveProperty('owner_id');
  });

  it('throws NotFoundException when the rental does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne(42)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a rental owned by the current user with a public picture url', async () => {
    const dto = { name: 'n', surface: 10, price: 100, description: 'd' };

    await expect(service.create(dto, picture, 3)).resolves.toEqual({
      message: 'Rental created!',
    });
    expect(repository.create).toHaveBeenCalledWith({
      ...dto,
      owner_id: 3,
      picture: 'http://api.test/uploads/b.png',
    });
  });

  it('refuses to update a rental owned by someone else', async () => {
    await expect(
      service.update(1, { price: 1 }, undefined, 99),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when updating an unknown rental', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.update(42, { price: 1 }, undefined, 7),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates the rental of its owner', async () => {
    await expect(service.update(1, { price: 1 }, picture, 7)).resolves.toEqual({
      message: 'Rental updated!',
    });
    expect(repository.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        price: 1,
        picture: 'http://api.test/uploads/b.png',
      }),
    );
  });
});
