import { HttpException, Injectable } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SurveyService {
  constructor(private readonly prismaService: PrismaService) { }

  /**
   * Create a new survey
   * @param createSurveyDto - Data transfer object containing survey details
   * @returns Created survey entry
   */
  async create(createSurveyDto: CreateSurveyDto) {
    const { topic, description, userId } = createSurveyDto;

    // Find the user by ID
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });

    // Check if the user exists
    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    // Create a new survey entry
    const survey = await this.prismaService.survey.create({
      data: {
        topic,
        description,
        userId: user.id,
      },
    });

    return { status: 201, data: survey };
  }

  /**
   * Find all surveys
   * @returns List of all surveys
   */
  async findAll() {
    const surveys = await this.prismaService.survey.findMany();
    return { status: 200, data: surveys };
  }

  /**
   * Find a survey by ID
   * @param id - ID of the survey to retrieve
   * @returns Survey entry or error response
   */
  async findOne(id: number) {
    const survey = await this.prismaService.survey.findUnique({
      where: { id },
    });

    if (!survey) {
      return { status: 404, message: 'Survey not found' };
    }

    return { status: 200, data: survey };
  }

  /**
   * Update a survey by ID
   * @param id - ID of the survey to update
   * @param updateSurveyDto - Data transfer object containing updated survey details
   * @returns Updated survey entry or error response
   */
  async update(id: number, updateSurveyDto: UpdateSurveyDto) {
    const survey = await this.prismaService.survey.findUnique({
      where: { id },
    });

    if (!survey) {
      return { status: 404, message: 'Survey not found' };
    }

    const updatedSurvey = await this.prismaService.survey.update({
      where: { id },
      data: updateSurveyDto,
    });

    return { status: 200, data: updatedSurvey };
  }

  /**
   * Remove a survey by ID
   * @param id - ID of the survey to remove
   * @returns Success message or error response
   */
  async remove(id: number) {
    const survey = await this.prismaService.survey.findUnique({
      where: { id },
    });

    if (!survey) {
      return { status: 404, message: 'Survey not found' };
    }

    await this.prismaService.survey.delete({
      where: { id },
    });

    return { status: 200, message: 'Survey removed successfully' };
  }


  /**
    * Fetch answers and get inferences from the Gemini API based on the survey topic
    * @param topic - Topic of the survey to fetch answers for
    * @returns Inferences from the Gemini API
    */
  async getInferences(topic: string) {
    const surveys = await this.prismaService.survey.findMany({
      where: {
        topic,
      },
    });

    if (!surveys.length) {
      throw new HttpException('No surveys found for the given topic', 404);
    }

    const answers = surveys.map((survey) => survey.description);
    
    const response = { data: answers, status: 201 }
    //? const response = await this.httpService.post('https://api.gemini.com/inferences', { answers }).toPromise();

    if (response.status !== 200) {
      throw new HttpException('Failed to get inferences from Gemini API', response.status);
    }

    return { status: 200, data: response.data };
  }
}
