import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from "@prisma/client"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findOneByEmail(email:string){
    return this.prisma.users.findUnique({
      where: { email },
    })
  }
  async create(data: Prisma.usersCreateInput) {
    return this.prisma.users.create({
      data,
    })
  }
}
