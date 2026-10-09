import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'john.doe@example.com', description: "L'adresse email de l'utilisateur" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'MotDePasse123!', description: 'Le mot de passe en clair' })
    @IsString()
    @IsNotEmpty()
    password: string;
}