import { QuestionType } from "@prisma/client";

export class CreateQuestionDto {
    text: string;
    type: QuestionType;
    correctAnswer: string;
    options?: string[];
}