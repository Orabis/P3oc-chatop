import {Body, Controller, Post, UseGuards, Request} from '@nestjs/common';
import {AuthService} from "./auth.service.js";
import {RegisterDto} from "./dto/register.dto.js";
import {LocalAuthGuard} from "./guards/local-auth.guard.js";
import type {AuthenticatedRequest} from "./interfaces/auth-request.interface.ts";
import {LoginDto} from "./dto/login.dto.js";
import {ApiBody} from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}
    @Post('register')
    async createAccount(@Body() registerDto: RegisterDto){
        return this.auth.register(registerDto)
    }
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(@Request() req:AuthenticatedRequest) {
        return this.auth.login(req.user);
    }

}
