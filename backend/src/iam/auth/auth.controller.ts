import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { TokenResponseDto } from './dto/token-response.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { Public } from './decorators/public.decorator.js';
import type { AuthenticatedRequest } from './interfaces/auth-request.interface.js';
import { UserResponseDto } from '../users/dto/user-response.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  /** Crée un compte utilisateur et renvoie un token JWT. */
  @Public()
  @Post('register')
  createAccount(@Body() registerDto: RegisterDto): Promise<TokenResponseDto> {
    return this.auth.registerUser(registerDto);
  }

  /** Authentifie l'utilisateur par email / mot de passe et renvoie un token JWT. */
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginAccount(@Request() req: AuthenticatedRequest): TokenResponseDto {
    return this.auth.loginUser(req.user);
  }

  /** Renvoie le profil de l'utilisateur connecté. */
  @ApiBearerAuth()
  @Get('me')
  me(@Request() req: AuthenticatedRequest): Promise<UserResponseDto> {
    return this.auth.getCurrentUser(req.user);
  }
}
