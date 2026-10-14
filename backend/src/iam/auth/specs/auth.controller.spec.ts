import { AuthController } from '../auth.controller.js';
import { AuthService } from '../auth.service.js';

describe('AuthController', () => {
  const currentUser = { id: 1, email: 'john@example.com' };
  let controller: AuthController;
  let authService: {
    loginUser: ReturnType<typeof vi.fn>;
    getCurrentUser: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authService = {
      loginUser: vi.fn().mockReturnValue({ token: 'jwt' }),
      getCurrentUser: vi.fn(),
    };
    controller = new AuthController(authService as unknown as AuthService);
  });

  it('logs in the user authenticated by the local strategy', () => {
    expect(controller.loginAccount({ user: currentUser })).toEqual({
      token: 'jwt',
    });
    expect(authService.loginUser).toHaveBeenCalledWith(currentUser);
  });

  it('returns the profile of the user from the token only', async () => {
    await controller.me({ user: currentUser });

    expect(authService.getCurrentUser).toHaveBeenCalledWith(currentUser);
  });
});
