import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { MessageResponseDto } from '../core/dto/message-response.dto.js';

@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  /** Envoie un message au propriétaire d'une location. */
  @Post()
  create(@Body() dto: CreateMessageDto): Promise<MessageResponseDto> {
    return this.messagesService.create(dto);
  }
}
