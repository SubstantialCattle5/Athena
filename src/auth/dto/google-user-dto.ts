// src/user/dto/google-user.dto.ts
import { IsString, IsEmail, IsBoolean, IsUrl } from 'class-validator';

export class GoogleUserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  verified_email: boolean;

  @IsString()
  name: string;

  @IsString()
  given_name: string;

  @IsString()
  family_name: string;

  @IsUrl()
  picture: string;

  @IsString()
  locale: string;
}
