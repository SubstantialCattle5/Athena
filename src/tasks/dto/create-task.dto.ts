import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'The email of the user issuing the task.' })
  @IsEmail()
  @IsNotEmpty()
  IssueByEmail: string;

  @ApiProperty({ description: 'The email of the user to whom the task is issued.' })
  @IsEmail()
  @IsNotEmpty()
  IssuedToEmail: string;

  @ApiProperty({ description: 'The date of the task.' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'The name of the task.' })
  @IsString()
  @IsNotEmpty()
  taskName: string;
}
