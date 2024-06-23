import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/CreateUser.dto';
import * as util from "./validation";
@Injectable()
export class UserService {

  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      util.checkDto(createUserDto);
      const user = await this.prismaService.user.findUnique({
        where: {
          email: createUserDto.email
        }
      })
      if (user) {
        throw new BadRequestException(["User already exist"])
      }
      return await this.prismaService.user.create({
        data: createUserDto,
        select: {
          age: true, birthday: true, gender: true, email: true, location: true, position: true, picture: true
        }
      });
    } catch (error) {
      throw (error);
    }
  }


  async findAll() {
    try {
      return await this.prismaService.user.findMany();
    } catch (error) {
      throw (error);
    }
  }


  async findOne(userId: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw (error);
    }
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      util.checkUpdateDto(updateUserDto);
      const user = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });
      return user;
    } catch (error) {
      throw (error);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prismaService.user.delete({
        where: { id },
      });
      return user;
    } catch (error) {
      this.handlePrismaError(error, 'delete user');
    }
  }


  private handlePrismaError(error: any, context: string) {
    if (error.code) {
      // Handle known Prisma errors based on the error code
      switch (error.code) {
        case 'P2002': // Unique constraint failed
          throw new BadRequestException(`A record with this ${error.meta.target} already exists.`);
        // Add more cases as needed
        default:
          throw new BadRequestException(`An error occurred while trying to ${context}`);
      }
    } else {
      throw new BadRequestException(`An unexpected error occurred while trying to ${context}`);
    }
  }
}
