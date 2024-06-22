import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata, Catch, UseFilters } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/auth.decorator';
import { UserInterface } from 'src/auth/interfaces/user.interface';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AllExceptionsFilter } from 'src/custom-exception/custom-exception.filter';

@UseFilters(AllExceptionsFilter)
@ApiBearerAuth()
@SetMetadata('roles', ['SUPERVISOR', 'EMPLOYEE'])
@UseGuards(JwtGuard, RolesGuard)
@ApiTags("Task")
@Controller('tasks')
export class TasksController {
  // Injecting the TasksService into the controller
  constructor(private readonly tasksService: TasksService) { }

  // Endpoint for creating a new task
  @Post()
  @ApiOperation({ summary: "Create a new task" })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  async create(@Body() createTaskDto: CreateTaskDto, @User() user: UserInterface) {
    const result = await this.tasksService.create(createTaskDto, user.id);
    return result;
  }

  // Endpoint for fetching all tasks related to a specific user
  @Get(':id')
  @ApiOperation({ summary: "Find all tasks based on user" })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  @ApiParam({ name: 'id', type: Number, required: true })
  async findAll(@Param('id') userId: string) {

    const result = await this.tasksService.findAll(+userId);
    return result;
  }

  // Endpoint for fetching a specific task by its ID
  @Get(':id')
  @ApiOperation({ summary: "Find a specific task" })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the task', required: true })
  async findOne(@Param('id') id: string) {
    const result = await this.tasksService.findOne(+id);
    return result;
  }

  // Endpoint for updating a task by its ID
  @Patch(':id')
  @ApiOperation({ summary: "Update a specific task" })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the task', required: true })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @User() user: UserInterface) {
    const result = await this.tasksService.update(+id, updateTaskDto,user.id);
    return result;
  }

  // Endpoint for removing a task by its ID
  @Delete(':id')
  @ApiOperation({ summary: "Remove a specific task" })
  @ApiResponse({ status: 200, description: 'Task removed successfully.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the task', required: true })
  async remove(@Param('id') id: string) {
    const result = await this.tasksService.remove(+id);
    return result;
  }
}
