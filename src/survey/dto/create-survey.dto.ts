import { IsArray, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateSurveyDto {

    @ApiProperty({ description: 'The topic of the survey.' })
    @IsString()
    topic: string;

    @ApiProperty({ description: 'The description of the survey.' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'The ID of the user creating the survey.' })
    @IsNumber()
    userId: number;

    @ApiProperty({description : "Array of question ids"})
    @IsArray()
    oldQuestions : number[] ; 


    
}
