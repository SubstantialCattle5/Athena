import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { UserInterface } from 'src/auth/interfaces/user.interface';
import { User } from 'src/auth/auth.decorator';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) { }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createQuizDto: CreateQuizDto, @User() user: UserInterface) {
    return this.quizService.create(user.id, createQuizDto);
  }

  @Get(":topic")
  @ApiParam(
    { name: 'topic', required: true, description: "put a topic" }
  )
  findAll(@Body() topics: { topicName: string }) {
    const topicName = topics.topicName;
    return this.quizService.findAll(topicName);
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
  //   return this.quizService.update(+id, updateQuizDto);
  // }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }
}
