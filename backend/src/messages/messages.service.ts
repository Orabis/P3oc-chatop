import { Injectable, NotFoundException } from '@nestjs/common';
import { MessagesRepository } from './messages.repository.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { RentalsService } from '../rentals/rentals.service.js';
import { UsersService } from '../iam/users/users.service.js';
import { MessageResponseDto } from '../core/dto/message-response.dto.js';

@Injectable()
export class MessagesService {
  constructor(
    private messagesRepository: MessagesRepository,
    private rentalsService: RentalsService,
    private usersService: UsersService,
  ) {}

  async create(dto: CreateMessageDto): Promise<MessageResponseDto> {
    if (!(await this.rentalsService.exists(dto.rental_id))) {
      throw new NotFoundException('Rental not found');
    }
    if (!(await this.usersService.exists(dto.user_id))) {
      throw new NotFoundException('User not found');
    }
    await this.messagesRepository.create(dto);
    return { message: 'Message sent!' };
  }
}
