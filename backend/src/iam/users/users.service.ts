import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersRepository } from './users.repository.js';
import { UserResponseDto } from './dto/user-response.dto.js';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  findOneByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findOneById(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserResponseDto.fromEntity(user);
  }

  async exists(id: number): Promise<boolean> {
    return (await this.usersRepository.findById(id)) !== null;
  }

  create(data: Prisma.usersCreateInput) {
    return this.usersRepository.create(data);
  }
}
