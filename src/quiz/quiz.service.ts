import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuizService {

  constructor(private readonly prismaService: PrismaService) { }
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
      throw (error);
    }
  }

  async findAll(topic: string) {
    try {
      if (topic === "") {
        const quizzesFull = await this.prismaService.quiz.findMany({
          include: {
            questions: {
              select: {
                text: true,
                type: true,
                correctAnswer: true,
                options: true,
              }
            }
          }
        });

        return quizzesFull.map(quiz => ({
          topic: quiz.topic,
          created: quiz.createdAt,
          questions: quiz.questions,
          id: quiz.id
        }))
      }

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
      throw (error);
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
      throw (error);
    }
  }

  async findTopics() {
    try {
      const quizTopics = await this.prismaService.quiz.findMany(
        {
          select: {
            topic: true
          },
          distinct: ['topic']
        }
      );
      return quizTopics.flatMap((quizTopic) => quizTopic.topic);
    } catch (error) {
      throw error
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
      throw (error);
    }
  }
}
