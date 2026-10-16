import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './core/prisma/prisma.module.js';
import { UsersModule } from './iam/users/users.module.js';
import { AuthModule } from './iam/auth/auth.module.js';
import { RentalsModule } from './rentals/rentals.module.js';
import { MessagesModule } from './messages/messages.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    RentalsModule,
    MessagesModule,
  ],
})
export class AppModule {}
