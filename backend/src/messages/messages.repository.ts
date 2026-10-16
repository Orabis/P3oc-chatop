import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../core/prisma/prisma.service.js';

@Injectable()
export class MessagesRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.messagesUncheckedCreateInput) {
    return this.prisma.messages.create({ data });
  }
}
