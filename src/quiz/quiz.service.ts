import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizService {

  constructor(private readonly prismaService: PrismaService) { }
  async create(userId: number, createQuizDto: CreateQuizDto) {
    const { questions, topic } = createQuizDto;

    // create questions 
    try {
      const quiz = await this.prismaService.quiz.create({
        data: {
          topic,
          userId
        }
      })

      questions.map(async (question) => {
        await this.prismaService.question.create({
          data: {
            correctAnswer: question.correctAnswer,
            text: question.text,
            options: question.options,
            type: question.type,
            quizId: quiz.id
          }
        })
      })

      return quiz;
    } catch (error) {
      return 'error'
    }
    return 'This action adds a new quiz';
  }

  findAll() {
    return `This action returns all quiz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quiz`;
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return `This action updates a #${id} quiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} quiz`;
  }
}
