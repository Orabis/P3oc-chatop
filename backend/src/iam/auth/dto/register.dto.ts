import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: "L'email fourni n'est pas valide." })
    @IsNotEmpty()
    email: string;

    @IsString()
    @MaxLength(35)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères.' })
    @IsNotEmpty()
    password: string;


}