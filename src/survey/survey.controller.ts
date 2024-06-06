import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Query, Res } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.create(createSurveyDto);
  }

  @Get()
  findAll() {
    return this.surveyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveyService.update(+id, updateSurveyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveyService.remove(+id);
  }

  @Get('inferences')
  @ApiOperation({ summary: 'Get inferences for a topic' })
  @ApiResponse({ status: 200, description: 'Inferences retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No surveys found for the given topic.' })
  @ApiResponse({ status: 500, description: 'Failed to get inferences from Gemini API.' })
  async getInferences(@Query('topic') topic: string, @Res() res) {
    try {
      const inferences = await this.surveyService.getInferences(topic);
      return res.status(200).json(inferences);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).json(error.getResponse());
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

