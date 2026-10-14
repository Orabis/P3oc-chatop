import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { CredentialsService } from '../credentials/credentials.service.js';
import {
  loginData,
  registerData,
} from './interfaces/auth-service.interface.js';
import type {
  JwtPayload,
  UserPayload,
} from './interfaces/auth-request.interface.js';
import { TokenResponseDto } from './dto/token-response.dto.js';
import { UserResponseDto } from '../users/dto/user-response.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private credentialsService: CredentialsService,
  ) {}

  async registerUser(data: registerData): Promise<TokenResponseDto> {
    if (await this.usersService.findOneByEmail(data.email)) {
      throw new BadRequestException('Email already exists');
    }
    const user = await this.usersService.create({
      name: data.name,
      email: data.email,
      password: await this.credentialsService.hashPassword(data.password),
    });
    return this.generateToken({ id: user.id, email: user.email });
  }

  async validateUser(data: loginData): Promise<UserPayload | null> {
    const user = await this.usersService.findOneByEmail(data.email);
    if (
      user &&
      (await this.credentialsService.checkPassword(
        data.password,
        user.password,
      ))
    ) {
      return { id: user.id, email: user.email };
    }
    return null;
  }

  loginUser(user: UserPayload): TokenResponseDto {
    return this.generateToken(user);
  }

  getCurrentUser(user: UserPayload): Promise<UserResponseDto> {
    return this.usersService.findOneById(user.id);
  }

  private generateToken(user: UserPayload): TokenResponseDto {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return { token: this.jwtService.sign(payload) };
  }
}
