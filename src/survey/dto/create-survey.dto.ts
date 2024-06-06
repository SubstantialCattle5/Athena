import { IsNumber, IsString } from "class-validator";

export class CreateSurveyDto {

    @IsString()
    topic: string;

    @IsString()
    description: string;

    @IsNumber()
    userId: number;
}
