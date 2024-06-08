import { IsString, IsInt, IsEmail, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Gender, Position } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'The name of the user.', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'The age of the user.', required: false })
  @IsInt()
  @IsOptional()
  age?: number;

  @ApiProperty({ description: 'The birthday of the user.', required: false })
  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @ApiProperty({ description: 'The location of the user.', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'The gender of the user.', enum: Gender, required: false })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ description: 'The email of the user.', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'The contact number of the user.', required: false })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiProperty({ description: 'The picture URL of the user.', required: false })
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty({ description: 'The position of the user.', enum: Position, required: false })
  @IsEnum(Position)
  @IsOptional()
  position?: Position;
}
