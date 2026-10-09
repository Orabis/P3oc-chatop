import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service.js";
import {JwtService} from "@nestjs/jwt";
import {loginData, registerData} from "./interfaces/auth-service.interface.js";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async register(data: registerData){
        if (await this.usersService.findOneByEmail(data.email)){
            throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);
        }
        await this.usersService.create(data)
    }
    async validateUser(data: loginData){
        const user = await this.usersService.findOneByEmail(data.email);
        if (user && user.password === data.password){
            const { password, ...result } = user;
            return result;
        }
        return null
    }
    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
