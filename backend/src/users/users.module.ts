import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Module({
  providers: [UsersService]
})
export class UsersModule {

}
// TODO : https://docs.nestjs.com/data/prisma