import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new task.
   * @param createTaskDto - The data transfer object containing the task details.
   * @returns An object containing the status and the created task data or an error message.
   */
  async create(createTaskDto: CreateTaskDto) {
    const { IssueByEmail, IssuedToEmail, date, taskName } = createTaskDto;

    // Fetch users
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
      return {
        status: "404",
        message: "user not found"
      };
    }

    // Create task
    const result = await this.prismaService.task.create({
      data: {
        date,
        taskName,
        issuedById: issuedBy.id,
        userId: issuedTo.id,
        status: 'UPCOMING'
      }
    });

    if (!result) {
      return {
        status: "501",
        message: "Error in generating task"
      };
    }

    return {
      status: "200",
      data: result
    };
  }

  /**
   * Finds all tasks related to a specific user.
   * @param email - The email of the user.
   * @returns An object containing the status and the tasks data or an error message.
   */
  async findAll(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return {
        status: "404",
        message: "user not found"
      };
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
      status: "200",
      data: {
        issuedToTheUser: tasks.filter(task => task.issuedById == user.id),
        issuedByTheUser: tasks.filter(task => task.userId == user.id)
      }
    };
  }

  /**
   * Finds a task by its ID.
   * @param id - The ID of the task.
   * @returns An object containing the status and the task data or an error message.
   */
  async findOne(id: number) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id
      }
    });

    if (!task) {
      return {
        status: "404",
        message: "Task not available"
      };
    }

    return { status: "200", data: task };
  }

  /**
   * Updates a task by its ID.
   * @param id - The ID of the task.
   * @param updateTaskDto - The data transfer object containing the updated task details.
   * @returns An object containing the status and the updated task data or an error message.
   */
  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { IssueByEmail, IssuedToEmail, date, taskName, status } = updateTaskDto;


    const task = await this.prismaService.task.update({
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

    if (!task) {
      return {
        status: "404",
        message: "Task not available"
      };
    }

    return {
      status: "200",
      data: task
    };
  }

  /**
   * Removes a task by its ID.
   * @param id - The ID of the task.
   * @returns An object containing the status and a success message or an error message.
   */
  async remove(id: number) {
    const task = await this.prismaService.task.delete({
      where: { id },
    });

    if (!task) {
      return {
        status: '404',
        message: 'Task not available',
      };
    }

    return {
      status: '200',
      message: `Task #${id} removed successfully`,
    };
  }
}
