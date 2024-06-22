import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionType } from "@prisma/client"
import { SurveyResponseDto } from './dto/survey-response.dto';
@Injectable()
export class SurveyService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createSurveyDto: CreateSurveyDto, userId: number) {
    try {
      const { topic, description, questions } = createSurveyDto;
      const result = await this.prismaService.$transaction(async (prisma) => {
        const survey = await prisma.survey.create({
          data: {
            description,
            topic,
            userId
          }
        })
        await Promise.all(questions.map(
          (question) => {
            return prisma.question.create({
              data: {
                correctAnswer: "what your heart desires",
                text: question.text,
                type: question.type as QuestionType,
                options: question.options,
                surveyId: survey.id
              }
            })
          }
        ))
      })

      return result;
    } catch (error) {
      throw (error)
    }
  }

  async findAll(topic: string) {
    try {
      return await this.prismaService.survey.findMany({
        where: {
          topic
        },
        select: {
          questions: {
            select: {
              options: true,
              text: true,
              type: true
            }
          }
        }
      });
    } catch (error) {
      throw (error)
    }
  }

  async findOne(id: number) {
    try {
      const survey = await this.prismaService.survey.findUnique({
        where: { id },
      });

      if (!survey) {
        throw new NotFoundException('Survey not found');
      }

      return survey;
    } catch (error) {
      throw (error)
    }
  }


  async remove(id: number) {
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
      throw error
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

    const response = { data: answers, status: 201 }
    //? const response = await this.httpService.post('https://api.gemini.com/inferences', { answers }).toPromise();

    if (response.status !== 200) {
      throw new HttpException('Failed to get inferences from Gemini API', response.status);
    }

    return response.data;
  }

  async surveyResponse(surveyResponse: SurveyResponseDto, userId: number) {
    const { answers } = surveyResponse;
    try {
      await Promise.all(answers.map(
        (answer) => {
          return this.prismaService.answer.create({
            data: {
              response: answer.response,
              questionId: answer.questionId,
              userId
            }
          })
        }
      ))
    }
    catch (error) {
      throw (error)
    }
  }
}
