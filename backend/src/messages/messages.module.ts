import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller.js';
import { MessagesService } from './messages.service.js';
import { MessagesRepository } from './messages.repository.js';
import { RentalsModule } from '../rentals/rentals.module.js';
import { UsersModule } from '../iam/users/users.module.js';

@Module({
  imports: [RentalsModule, UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
})
export class MessagesModule {}
