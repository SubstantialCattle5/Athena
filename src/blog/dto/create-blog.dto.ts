import { IsInt, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  pic: string;

  @IsString()
  content: string;

  @IsString()
  region: string;

  @IsInt()
  authorId: string;

  @IsString()
  language: string;
}
