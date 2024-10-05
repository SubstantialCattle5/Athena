import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionType } from '@prisma/client';
import { SurveyResponseDto } from './dto/survey-response.dto';
@Injectable()
export class SurveyService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSurveyDto: CreateSurveyDto, userId: string) {
    try {
      const { topic, description, questions } = createSurveyDto;
      const result = await this.prismaService.$transaction(async (prisma) => {
        const survey = await prisma.survey.create({
          data: {
            description,
            topic,
            userId,
          },
        });
        await Promise.all(
          questions.map((question) => {
            return prisma.question.create({
              data: {
                correctAnswer: 'what your heart desires',
                text: question.text,
                type: question.type as QuestionType,
                options: question.options,
                surveyId: survey.id,
              },
            });
          }),
        );
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll(topic: string) {
    try {
      if (topic === '') {
        return await this.prismaService.survey.findMany({
          select: {
            id: true,
            topic: true,
            description: true,
            questions: {
              select: {
                options: true,
                text: true,
                type: true,
                id: true,
              },
            },
          },
        });
      }
      return await this.prismaService.survey.findMany({
        where: {
          topic,
        },
        select: {
          id: true,
          topic: true,
          description: true,
          questions: {
            select: {
              options: true,
              text: true,
              type: true,
              id: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const survey = await this.prismaService.survey.findUnique({
        where: { id },
      });

      if (!survey) {
        throw new NotFoundException('Survey not found');
      }

      return survey;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const survey = await this.prismaService.survey.findUnique({
        where: { id },
      });

      if (!survey) {
        throw new NotFoundException('Survey not found');
      }

      await this.prismaService.survey.delete({
        where: { id },
      });

      return `Survey removed successfully`;
    } catch (error) {
      throw error;
    }
  }

  async getInferences(topic: string) {
    const surveys = await this.prismaService.survey.findMany({
      where: {
        topic,
      },
    });

    if (!surveys.length) {
      throw new NotFoundException('No surveys found for the given topic');
    }

    const answers = surveys.map((survey) => survey.description);

    const response = { data: answers, status: 201 };
    //? const response = await this.httpService.post('https://api.gemini.com/inferences', { answers }).toPromise();

    if (response.status !== 200) {
      throw new HttpException(
        'Failed to get inferences from Gemini API',
        response.status,
      );
    }

    return response.data;
  }

  async surveyResponse(surveyResponse: SurveyResponseDto, userId: string) {
    const { answers } = surveyResponse;
    try {
      await Promise.all(
        answers.map((answer) => {
          return this.prismaService.answer.create({
            data: {
              response: answer.response,
              questionId: answer.questionId,
              userId,
            },
          });
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async surveyResponseBasedOnId(id: string) {
    try {
      const repsonses = await this.prismaService.survey.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          description: true,
          topic: true,
          questions: {
            select: {
              answers: {
                include: {
                  user: {
                    select: {
                      gender: true,
                      age: true,
                      location: true,
                    },
                  },
                },
              },
              id: true,
              options: true,
              text: true,
            },
          },
        },
      });
      return {
        description: repsonses.description,
        topic: repsonses.topic,
        questions: repsonses.questions.map((res) => {
          return {
            text: res.text,
            options: res.options,
            answers: res.answers.map((ans) => {
              return {
                response: ans.response,
                age: ans.user.age,
                gender: ans.user.gender,
                location: ans.user.location,
              };
            }),
          };
        }),
      };
    } catch (error) {
      throw error;
    }
  }
}
