import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JwtGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserInterface } from '../auth/interfaces/user.interface';
import { User } from '../auth/auth.decorator';

@UseGuards(JwtGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) { }


  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createQuizDto: CreateQuizDto, @User() user: UserInterface) {
    return this.quizService.create(user.id,createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id);
  }
}
