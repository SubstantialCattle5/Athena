import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuizService {

  constructor(private readonly prismaService: PrismaService) { }

  private handleError(error: any): never {
    console.error(error); // Log the error for debugging
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Database request failed: ${error.message}`);
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error(`Validation failed: ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }

  async create(userId: number, createQuizDto: CreateQuizDto) {
    const { questions, topic } = createQuizDto;

    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const quiz = await prisma.quiz.create({
          data: {
            topic,
            userId
          }
        });

        await Promise.all(questions.map(question => {
          return prisma.question.create({
            data: {
              correctAnswer: question.correctAnswer,
              text: question.text,
              options: question.options,
              type: question.type,
              quizId: quiz.id
            }
          });
        }));

        return quiz;
      });

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(topic: string) {
    try {
      const quizzes = await this.prismaService.quiz.findMany({
        where: { topic },
        include: {
          questions: {
            select: {
              text: true,
              type: true,
              correctAnswer: true,
              options: true
            }
          }
        }
      });

      return quizzes.map(quiz => ({
        topic: quiz.topic,
        created: quiz.createdAt,
        questions: quiz.questions
      }));
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const quiz = await this.prismaService.quiz.findUniqueOrThrow({
        where: { id },
        include: {
          questions: true
        }
      });

      return quiz;
    } catch (error) {
      this.handleError(error);
    }
  }

  // async update(id: number, updateQuizDto: UpdateQuizDto) {
  //   try {
  //     const updatedQuiz = await this.prismaService.quiz.update({
  //       where: { id },
  //       data: updateQuizDto
  //     });

  //     return updatedQuiz;
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  async remove(id: number) {
    try {
      await this.prismaService.quiz.findUniqueOrThrow({
        where: { id },
      });

      const deletedQuiz = await this.prismaService.quiz.delete({
        where: { id },
      });

      return deletedQuiz;
    } catch (error) {
      this.handleError(error);
    }
  }
}
