import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, PrismaModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
