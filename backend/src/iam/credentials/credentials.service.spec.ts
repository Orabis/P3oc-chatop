import { PasswordHasher } from '@nestjs/authentication';
import { CredentialsService } from './credentials.service.js';

describe('CredentialsService', () => {
  const service = new CredentialsService(new PasswordHasher());

  it('verifies a password against its hash', async () => {
    const hash = await service.hashPassword('Password123');

    expect(hash).not.toBe('Password123');
    await expect(service.checkPassword('Password123', hash)).resolves.toBe(
      true,
    );
    await expect(service.checkPassword('wrong', hash)).resolves.toBe(false);
  });
});
