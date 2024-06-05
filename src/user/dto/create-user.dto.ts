import { IsString, IsInt, IsEmail, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Gender, Position } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsDateString()
  birthday: Date;

  @IsString()
  location: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEmail()
  email: string;

  @IsString()
  contact: string;

  @IsString()
  picture: string;

  @IsEnum(Position)
  position: Position;
}


