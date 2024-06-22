import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInterface } from 'src/auth/interfaces/user.interface';
import { User } from 'src/auth/auth.decorator';
import { SurveyResponseDto } from './dto/survey-response.dto';

@ApiTags("Survey")
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) { }

  @Post()
  @ApiOperation({ summary: "Create a new survey" })
  @ApiResponse({ status: 201, description: 'The survey has been successfully created.' })
  create(@Body() createSurveyDto: CreateSurveyDto) {
    const userId = 1;
    return this.surveyService.create(createSurveyDto, userId);
  }

  @Get(":topic")
  @ApiOperation({ summary: "Find all surveys" })
  @ApiResponse({ status: 200, description: 'Surveys retrieved successfully.' })
  findAll(@Param('topic') topic: string) {
    return this.surveyService.findAll(topic);
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
  update(@Param('id') id: string, @Body() updateSurveyDto: UpdateSurveyDto, @User() user: UserInterface) {
    return this.surveyService.update(+id, +user.id, updateSurveyDto);
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


  @Post('surveyresponse')
  @ApiOperation({ summary: "Response to a survey" })
  async postResponse(@User() user: UserInterface, @Body() surveyResponse: SurveyResponseDto) {
    return await this.surveyService.surveyResponse(surveyResponse, user.id)
  }
}
