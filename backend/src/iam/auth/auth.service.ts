import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service.js";
import {JwtService} from "@nestjs/jwt";
import {loginData, registerData} from "./interfaces/auth-service.interface.js";
import type { AuthenticatedRequest } from './interfaces/auth-request.interface.js';
import { CredentialsService } from '../credentials/credentials.service.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private credentialsService: CredentialsService,
  ) {}

  async registerUser(data: registerData) {
    if (await this.usersService.findOneByEmail(data.email)) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    const payload = {
      name: data.name,
      email: data.email,
      password: await this.credentialsService.hashPassword(data.password),
    };
    await this.usersService.create(payload);
  }
  async validateUser(data: loginData) {
    const user = await this.usersService.findOneByEmail(data.email);
    if (user && await this.credentialsService.checkPassword(data.password,user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async loginUser(req: AuthenticatedRequest) {
    const payload = { email: req.user.email, sub: req.user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
