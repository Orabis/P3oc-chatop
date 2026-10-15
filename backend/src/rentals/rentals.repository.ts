import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../core/prisma/prisma.service.js';
import { rentalWithOwner, RentalWithOwner } from './entities/rental.entity.js';

@Injectable()
export class RentalsRepository {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<RentalWithOwner[]> {
    return this.prisma.rentals.findMany({
      ...rentalWithOwner,
      orderBy: { created_at: 'desc' },
    });
  }

  findById(id: number): Promise<RentalWithOwner | null> {
    return this.prisma.rentals.findUnique({
      where: { id },
      ...rentalWithOwner,
    });
  }

  create(data: Prisma.rentalsUncheckedCreateInput) {
    return this.prisma.rentals.create({ data });
  }

  update(id: number, data: Prisma.rentalsUncheckedUpdateInput) {
    return this.prisma.rentals.update({ where: { id }, data });
  }
}
