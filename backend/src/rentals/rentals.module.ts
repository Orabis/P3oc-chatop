import { Module } from '@nestjs/common';
import { RentalsController } from './rentals.controller.js';
import { RentalsService } from './rentals.service.js';
import { RentalsRepository } from './rentals.repository.js';

@Module({
  controllers: [RentalsController],
  providers: [RentalsService, RentalsRepository],
  exports: [RentalsService],
})
export class RentalsModule {}
