import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateRentalDto } from './create-rental.dto.js';
import { UpdateRentalDto } from './update-rental.dto.js';

export class CreateRentalFormDto extends CreateRentalDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  picture: Express.Multer.File;
}

export class UpdateRentalFormDto extends UpdateRentalDto {
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  picture?: Express.Multer.File;
}
