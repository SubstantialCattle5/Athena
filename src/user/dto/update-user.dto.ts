// src/user/dto/update-user.dto.ts
import { IsString, IsInt, IsEmail, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Gender, Position } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsEnum(Position)
  @IsOptional()
  position?: Position;
}