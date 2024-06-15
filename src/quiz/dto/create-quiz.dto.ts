import { CreateQuestionDto } from "./create-question.dto";

export class CreateQuizDto {
    topic: string;
    questions: CreateQuestionDto[];
}
