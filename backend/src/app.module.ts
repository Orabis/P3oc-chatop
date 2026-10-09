import {Module} from '@nestjs/common';
import { UsersModule } from './iam/users/users.module.js';
import { PrismaModule } from './core/prisma/prisma.module.js';
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "./iam/auth/auth.module.js";

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      UsersModule,
      AuthModule,
      PrismaModule
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
