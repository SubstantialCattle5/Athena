import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsEmail()
  @IsNotEmpty()
  IssueByEmail: string;

  @IsEmail()
  @IsNotEmpty()
  IssuedToEmail: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  taskName: string;
}

