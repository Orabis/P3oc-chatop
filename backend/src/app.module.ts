import {Module, ValidationPipe} from '@nestjs/common';
import { UsersModule } from './iam/users/users.module.js';
import { PrismaModule } from './core/prisma/prisma.module.js';
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./iam/auth/auth.module.js";
import {APP_PIPE} from "@nestjs/core";

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      UsersModule,
      AuthModule,
      PrismaModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    }
  ],
  controllers: [],
})
export class AppModule {}
