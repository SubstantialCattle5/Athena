import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags("Task")
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  /**
   * Creates a new task.
   * @param createTaskDto - The data transfer object containing the task details.
   * @param response - The HTTP response object.
   * @returns The created task data or an error message.
   */
  @Post()
  @ApiOperation({ summary: "Create a new task" })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 501, description: 'Error in generating task.' })
  async create(@Body() createTaskDto: CreateTaskDto, @Res() response) {
    const result = await this.tasksService.create(createTaskDto);
    return response.status(result.status).json(result);
  }

  /**
   * Finds all tasks related to a specific user.
   * @param email - The email of the user.
   * @param response - The HTTP response object.
   * @returns The tasks data or an error message.
   */
  @Get()
  @ApiOperation({ summary: "Find all tasks based on user" })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiQuery({ name: 'email', type: String, description: 'The email of the user', required: true })
  async findAll(@Query('email') email: string, @Res() response) {
    const result = await this.tasksService.findAll(email);
    return response.status(result.status).json(result);
  }

  /**
   * Finds a specific task by its ID.
   * @param id - The ID of the task.
   * @param response - The HTTP response object.
   * @returns The task data or an error message.
   */
  @Get(':id')
  @ApiOperation({ summary: "Find a specific task" })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Task not available.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the task', required: true })
  async findOne(@Param('id') id: string, @Res() response) {
    const result = await this.tasksService.findOne(+id);
    return response.status(result.status).json(result);
  }

  /**
   * Updates a task by its ID.
   * @param id - The ID of the task.
   * @param updateTaskDto - The data transfer object containing the updated task details.
   * @returns The updated task data or an error message.
   */
  @Patch(':id')
  @ApiOperation({ summary: "Update a specific task" })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @ApiResponse({ status: 404, description: 'Task not available or user not found.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the task', required: true })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Res() response) {
    const result = await this.tasksService.update(+id, updateTaskDto);
    return response.status(result.status).json(result);
  }

  /**
   * Removes a task by its ID.
   * @param id - The ID of the task.
   * @returns A success message or an error message.
   */
  @Delete(':id')
  @ApiOperation({ summary: "Remove a specific task" })
  @ApiResponse({ status: 200, description: 'Task removed successfully.' })
  @ApiResponse({ status: 404, description: 'Task not available.' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the task', required: true })
  async remove(@Param('id') id: string, @Res() response) {
    const result = await this.tasksService.remove(+id);
    return response.status(result.status).json(result);
  }
}
