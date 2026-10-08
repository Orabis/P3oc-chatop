import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service.js";

@Injectable()
export class AuthService {
    constructor(private users : UsersService) {}

    async register(data: any){
        return this.users.create(data)
    }
}
