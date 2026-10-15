import { PartialType } from '@nestjs/swagger';
import { CreateRentalDto } from './create-rental.dto.js';

export class UpdateRentalDto extends PartialType(CreateRentalDto) {}
