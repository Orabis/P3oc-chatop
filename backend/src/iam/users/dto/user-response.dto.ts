import type { users } from '@prisma/client';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  created_at: Date | null;
  updated_at: Date | null;

  static fromEntity(user: users): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.created_at = user.created_at;
    dto.updated_at = user.updated_at;
    return dto;
  }
}
