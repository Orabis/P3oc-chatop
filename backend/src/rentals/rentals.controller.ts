import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RentalsService } from './rentals.service.js';
import { CreateRentalDto } from './dto/create-rental.dto.js';
import { UpdateRentalDto } from './dto/update-rental.dto.js';
import { RentalResponseDto } from './dto/rental-response.dto.js';
import { RentalsListResponseDto } from './dto/rentals-list-response.dto.js';
import { MessageResponseDto } from '../core/dto/message-response.dto.js';
import { imageUploadOptions } from '../core/uploads/uploads.config.js';
import type { AuthenticatedRequest } from '../iam/auth/interfaces/auth-request.interface.js';

@ApiTags('rentals')
@ApiBearerAuth()
@Controller('rentals')
export class RentalsController {
  constructor(private rentalsService: RentalsService) {}

  @Get()
  findAll(): Promise<RentalsListResponseDto> {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RentalResponseDto> {
    return this.rentalsService.findOne(id);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('picture', imageUploadOptions))
  create(
    @Body() dto: CreateRentalDto,
    @UploadedFile(new ParseFilePipe()) picture: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
  ): Promise<MessageResponseDto> {
    return this.rentalsService.create(dto, picture, req.user.id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('picture', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRentalDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    picture: Express.Multer.File | undefined,
    @Request() req: AuthenticatedRequest,
  ): Promise<MessageResponseDto> {
    return this.rentalsService.update(id, dto, picture, req.user.id);
  }
}
