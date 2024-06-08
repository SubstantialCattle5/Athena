import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      } else {
        this.logger.error(`Failed to create user: ${String(error)}`);
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      } else {
        this.logger.error(`Failed to fetch users: ${String(error)}`);
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiParam({ name: 'email', description: 'Email of the user' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('email') email: string) {
    try {
      const user = await this.userService.findOne(email);
      if (!user) {
        this.logger.warn(`User not found with email: ${email}`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to fetch user: ${error.message}`, error.stack);
      } else {
        this.logger.error(`Failed to fetch user: ${String(error)}`);
      }
      throw error instanceof HttpException ? error : new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':email')
  @ApiOperation({ summary: 'Update a user by email' })
  @ApiParam({ name: 'email', description: 'Email of the user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.update(email, updateUserDto);
      if (!updatedUser) {
        this.logger.warn(`User not found with email: ${email}`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`User updated with email: ${email}`);
      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to update user: ${error.message}`, error.stack);
      } else {
        this.logger.error(`Failed to update user: ${String(error)}`);
      }
      throw error instanceof HttpException ? error : new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Delete a user by email' })
  @ApiParam({ name: 'email', description: 'Email of the user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('email') email: string) {
    try {
      const deletedUser = await this.userService.remove(email);
      if (!deletedUser) {
        this.logger.warn(`User not found with email: ${email}`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`User deleted with email: ${email}`);
      return deletedUser;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
      } else {
        this.logger.error(`Failed to delete user: ${String(error)}`);
      }
      throw error instanceof HttpException ? error : new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
