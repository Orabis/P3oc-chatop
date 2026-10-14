import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service.js';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: number) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

  create(data: Prisma.usersCreateInput) {
    return this.prisma.users.create({ data });
  }
}
