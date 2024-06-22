import { ApiProperty } from "@nestjs/swagger";

export class SurveyResponseDto {
    @ApiProperty()
    answers: answersDto[];
}

export class answersDto {
    @ApiProperty()
    questionId: number;
    @ApiProperty()
    response: string;
    @ApiProperty()
    userId: number;
}