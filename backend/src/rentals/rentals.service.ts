import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RentalsRepository } from './rentals.repository.js';
import { CreateRentalDto } from './dto/create-rental.dto.js';
import { UpdateRentalDto } from './dto/update-rental.dto.js';
import { RentalResponseDto } from './dto/rental-response.dto.js';
import { RentalsListResponseDto } from './dto/rentals-list-response.dto.js';
import { MessageResponseDto } from '../core/dto/message-response.dto.js';
import { UPLOADS_ROUTE } from '../core/uploads/uploads.config.js';

@Injectable()
export class RentalsService {
  private readonly publicUrl: string;

  constructor(
    private rentalsRepository: RentalsRepository,
    configService: ConfigService,
  ) {
    this.publicUrl = configService.get<string>(
      'APP_URL',
      `http://localhost:${configService.get<string>('PORT', '3000')}`,
    );
  }

  async findAll(): Promise<RentalsListResponseDto> {
    const rentals = await this.rentalsRepository.findAll();
    return {
      rentals: rentals.map((rental) => RentalResponseDto.fromEntity(rental)),
    };
  }

  async findOne(id: number): Promise<RentalResponseDto> {
    const rental = await this.rentalsRepository.findById(id);
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    return RentalResponseDto.fromEntity(rental);
  }

  async exists(id: number): Promise<boolean> {
    return (await this.rentalsRepository.findById(id)) !== null;
  }

  async create(
    dto: CreateRentalDto,
    picture: Express.Multer.File,
    ownerId: number,
  ): Promise<MessageResponseDto> {
    await this.rentalsRepository.create({
      name: dto.name,
      surface: dto.surface,
      price: dto.price,
      description: dto.description,
      picture: this.toPictureUrl(picture),
      owner_id: ownerId,
    });
    return { message: 'Rental created!' };
  }

  async update(
    id: number,
    dto: UpdateRentalDto,
    picture: Express.Multer.File | undefined,
    userId: number,
  ): Promise<MessageResponseDto> {
    const rental = await this.rentalsRepository.findById(id);
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    if (rental.owner_id !== userId) {
      throw new ForbiddenException('You are not the owner of this rental');
    }
    await this.rentalsRepository.update(id, {
      name: dto.name,
      surface: dto.surface,
      price: dto.price,
      description: dto.description,
      picture: picture && this.toPictureUrl(picture),
      updated_at: new Date(),
    });
    return { message: 'Rental updated!' };
  }

  private toPictureUrl(picture: Express.Multer.File): string {
    return `${this.publicUrl}/${UPLOADS_ROUTE}/${picture.filename}`;
  }
}
