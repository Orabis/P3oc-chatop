import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service.js';

describe('PrismaService', () => {
  it('should be defined', () => {
    const config = {
      getOrThrow: () => 'mysql://user:pass@localhost:3306/chatop_db',
    } as unknown as ConfigService;

    expect(new PrismaService(config)).toBeDefined();
  });
});
