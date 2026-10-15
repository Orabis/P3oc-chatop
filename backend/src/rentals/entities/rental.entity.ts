import { Prisma } from '@prisma/client';

export const rentalWithOwner = {
  include: { owner: { select: { id: true, name: true } } },
} satisfies Prisma.rentalsDefaultArgs;

export type RentalWithOwner = Prisma.rentalsGetPayload<typeof rentalWithOwner>;
