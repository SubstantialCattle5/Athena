import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags("Task")
@Controller('tasks')
export class TasksController {
  // Injecting the TasksService into the controller
  constructor(private readonly tasksService: TasksService) { }

  // Endpoint for creating a new task
  @Post()
  @ApiOperation({ summary: "Create a new task" })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    const result = await this.tasksService.create(createTaskDto);
    return result;
  }

  // Endpoint for fetching all tasks related to a specific user
  @Get()
  @ApiOperation({ summary: "Find all tasks based on user" })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  @ApiQuery({ name: 'email', type: String, description: 'The email of the user', required: true })
  async findAll(@Query('email') email: string) {
    const result = await this.tasksService.findAll(email);
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
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const result = await this.tasksService.update(+id, updateTaskDto);
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
