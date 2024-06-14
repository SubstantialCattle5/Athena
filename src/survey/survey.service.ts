import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SurveyService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createSurveyDto: CreateSurveyDto) {
    // const { topic, description, userId, questions } = createSurveyDto;
    // const user = await this.prismaService.user.findFirst({
    //   where: {
    //     id: userId,
    //   },
    // });

    // if (!user) {
    //   throw new BadRequestException('User not found');
    // }

    // const survey = await this.prismaService.survey.create({
    //   data: {
    //     topic,
    //     description,
    //     userId: user.id,
    //     questions : { 
    //       connect : questions.map(id => ({id}))
    //     }
    //   },
    // });
    const survey = "fix"
    return survey;
  }

  async findAll() {
    const surveys = await this.prismaService.survey.findMany();
    return surveys;
  }

  async findOne(id: number) {
    const survey = await this.prismaService.survey.findUnique({
      where: { id },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    return survey;
  }

  async update(id: number, updateSurveyDto: UpdateSurveyDto) {
    const survey = await this.prismaService.survey.findUnique({
      where: { id },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    const updatedSurvey = await this.prismaService.survey.update({
      where: { id },
      data: updateSurveyDto,
    });

    return updatedSurvey;
  }

  async remove(id: number) {
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
}
