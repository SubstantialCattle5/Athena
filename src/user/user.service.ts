import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: createUserDto,
      });
      this.logger.log(`User created with email: ${user.email}`);
      return user;
    } catch (error) {
      this.handlePrismaError(error, 'create user');
    }
  }

  async findAll() {
    try {
      return await this.prismaService.user.findMany();
    } catch (error) {
      this.handlePrismaError(error, 'fetch all users');
    }
  }

  async findOne(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (!user) {
        this.logger.warn(`User not found with email: ${email}`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      this.handlePrismaError(error, 'fetch user');
    }
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.update({
        where: { email },
        data: updateUserDto,
      });
      this.logger.log(`User updated with email: ${email}`);
      return user;
    } catch (error) {
      this.handlePrismaError(error, 'update user');
    }
  }

  async remove(email: string) {
    try {
      const user = await this.prismaService.user.delete({
        where: { email },
      });
      this.logger.log(`User deleted with email: ${email}`);
      return user;
    } catch (error) {
      this.handlePrismaError(error, 'delete user');
    }
  }


  private handlePrismaError(error: unknown, context: string) {
    if (error instanceof Error) {
      this.logger.error(`Failed to ${context}: ${error.message}`, error.stack);
    } else {
      this.logger.error(`Failed to ${context}: ${String(error)}`);
    }
    throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
