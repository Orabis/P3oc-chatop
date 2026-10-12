import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service.js';
import { PasswordHasher } from '@nestjs/authentication';

@Module({
  providers: [CredentialsService, PasswordHasher],
  exports: [CredentialsService],
})
export class CredentialsModule {}
