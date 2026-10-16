import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @IsPositive()
  rental_id: number;

  @IsInt()
  @IsPositive()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
