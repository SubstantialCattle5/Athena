import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("Survey")
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  @ApiOperation({ summary: "Create a new survey" })
  @ApiResponse({ status: 201, description: 'The survey has been successfully created.' })
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.create(createSurveyDto);
  }

  @Get()
  @ApiOperation({ summary: "Find all surveys" })
  @ApiResponse({ status: 200, description: 'Surveys retrieved successfully.' })
  findAll() {
    return this.surveyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "Find a specific survey" })
  @ApiResponse({ status: 200, description: 'Survey retrieved successfully.' })
  findOne(@Param('id') id: string) {
    return this.surveyService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a specific survey" })
  @ApiResponse({ status: 200, description: 'Survey updated successfully.' })
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveyService.update(+id, updateSurveyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Remove a specific survey" })
  @ApiResponse({ status: 200, description: 'Survey removed successfully.' })
  remove(@Param('id') id: string) {
    return this.surveyService.remove(+id);
  }

  @Get('inferences')
  @ApiOperation({ summary: 'Get inferences for a topic' })
  @ApiResponse({ status: 200, description: 'Inferences retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'No surveys found for the given topic.' })
  @ApiResponse({ status: 500, description: 'Failed to get inferences from Gemini API.' })
  async getInferences(@Query('topic') topic: string) {
    return await this.surveyService.getInferences(topic);
  }
}
