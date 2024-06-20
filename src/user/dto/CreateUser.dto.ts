import { Gender, Position } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDateString, IsEnum, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user.' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The age of the user.' })
  @IsInt()
  age: number;

  @ApiProperty({ description: 'The birthday of the user.' })
  @IsDateString()
  birthday: Date;

  @ApiProperty({ description: 'The location of the user.' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'The gender of the user.', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: 'The email of the user.' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The contact number of the user.' })
  @IsString()
  contact: string;

  @ApiProperty({ description: 'The picture URL of the user.' })
  @IsString()
  picture: string;

  @ApiProperty({ description: 'The position of the user.', enum: Position })
  @IsEnum(Position)
  position: Position;
}
