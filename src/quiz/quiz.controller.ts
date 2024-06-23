import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseFilters } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UserInterface } from 'src/auth/interfaces/user.interface';
import { User } from 'src/auth/auth.decorator';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { AllExceptionsFilter } from 'src/custom-exception/custom-exception.filter';

@UseFilters(AllExceptionsFilter)
@ApiTags("Quiz")
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) { }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createQuizDto: CreateQuizDto, @User() user: UserInterface) {
    return this.quizService.create(user.id, createQuizDto);
  }

  @Get("/question/:topic")
  @ApiParam(
    { name: 'topic', required: true, description: "put a topic" }
  )
  findAllBasedTopics(@Body() topics: { topicName: string }) {
    const topicName = topics.topicName;
    return this.quizService.findAll(topicName);
  }


  @Get()
  async findAll() { 
    return this.quizService.findAll(""); 
  }


  @Get("/topics")
  findTopics() {
    return this.quizService.findTopics();
  }


  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }
}


