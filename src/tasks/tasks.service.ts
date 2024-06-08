import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const { IssueByEmail, IssuedToEmail, date, taskName } = createTaskDto;

    const issuedTo = await this.prismaService.user.findUnique({
      where: {
        email: IssuedToEmail
      }
    });
    const issuedBy = await this.prismaService.user.findUnique({
      where: {
        email: IssueByEmail
      }
    });

    if (!issuedBy || !issuedTo) {
      throw new BadRequestException('User not found');
    }

    try {
      const result = await this.prismaService.task.create({
        data: {
          date,
          taskName,
          issuedById: issuedBy.id,
          userId: issuedTo.id,
          status: 'UPCOMING'
        }
      });

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error in generating task');
    }
  }

  async findAll(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tasks = await this.prismaService.task.findMany({
      where: {
        OR: [
          {
            issuedById: user.id
          },
          {
            userId: user.id
          }
        ]
      }
    });

    return {
      issuedToTheUser: tasks.filter(task => task.issuedById == user.id),
      issuedByTheUser: tasks.filter(task => task.userId == user.id)
    };
  }

  async findOne(id: number) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id
      }
    });

    if (!task) {
      throw new NotFoundException('Task not available');
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { IssueByEmail, IssuedToEmail, date, taskName, status } = updateTaskDto;

    const task = await this.prismaService.task.findUnique({
      where: {
        id
      }
    });

    if (!task) {
      throw new NotFoundException('Task not available');
    }

    try {
      const updatedTask = await this.prismaService.task.update({
        where: {
          id
        },
        data: {
          taskName,
          date,
          updatedAt: new Date(),
          status
        }
      });

      return updatedTask;
    } catch (error) {
      throw new InternalServerErrorException('Error in updating task');
    }
  }

  async remove(id: number) {
    const task = await this.prismaService.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not available');
    }

    try {
      await this.prismaService.task.delete({
        where: { id },
      });

      return `Task #${id} removed successfully`;
    } catch (error) {
      throw new InternalServerErrorException('Error in removing task');
    }
  }
}
