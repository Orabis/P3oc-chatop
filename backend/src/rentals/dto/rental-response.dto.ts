import { RentalWithOwner } from '../entities/rental.entity.js';
import { RentalOwnerDto } from './rental-owner.dto.js';

export class RentalResponseDto {
  id: number;
  name: string;
  surface: number;
  price: number;
  picture: string | null;
  description: string;
  owner: RentalOwnerDto;
  created_at: Date | null;
  updated_at: Date | null;

  static fromEntity(rental: RentalWithOwner): RentalResponseDto {
    const dto = new RentalResponseDto();
    dto.id = rental.id;
    dto.name = rental.name;
    dto.surface = rental.surface.toNumber();
    dto.price = rental.price.toNumber();
    dto.picture = rental.picture;
    dto.description = rental.description;
    dto.owner = { id: rental.owner.id, name: rental.owner.name };
    dto.created_at = rental.created_at;
    dto.updated_at = rental.updated_at;
    return dto;
  }
}
