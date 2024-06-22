import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Catch, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/CreateUser.dto';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/auth.decorator';
import { UserInterface } from 'src/auth/interfaces/user.interface';
import { AllExceptionsFilter } from 'src/custom-exception/custom-exception.filter';


@UseFilters(AllExceptionsFilter)
@ApiTags('user')
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return user;
  }


  @Get('/all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll() {
    return await this.userService.findAll();

  }


  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('')
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiParam({ name: 'email', description: 'Email of the user' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@User() userId: UserInterface) {
    return await this.userService.findOne(userId.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch('')
  @ApiOperation({ summary: 'Update a user by email' })
  @ApiParam({ name: 'email', description: 'Email of the user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@User() userId: UserInterface, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(userId.id, updateUserDto);
    return updatedUser;
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete('')
  @ApiOperation({ summary: 'Delete a user by email' })
  @ApiParam({ name: 'email', description: 'Email of the user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@User() userId: UserInterface) {
    const deletedUser = await this.userService.remove(userId.id);
    return deletedUser;
  }
}