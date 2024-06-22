import { IsArray, IsEnum, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { CreateQuestionDto } from "./create-question.dto";

export class CreateSurveyDto {

    @ApiProperty({ description: 'The topic of the survey.' })
    @IsString()
    topic: string;

    @ApiProperty({ description: 'The description of the survey.' })
    @IsString()
    description: string;


    @ApiProperty({ description: "Array of question ids" })
    @IsArray()
    questions: CreateQuestionDto[];



}
