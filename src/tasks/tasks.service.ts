import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) { }

  /**
   * Asynchronously creates a new task.
   * 
   * This function creates a task with the given details, associates it with the users
   * identified by their email and ID, and sets the task status to UPCOMING.
   * 
   * @param {CreateTaskDto} createTaskDto - The data transfer object containing task details.
   * @param {number} userId - The ID of the user issuing the task.
   * @returns The newly created task object.
   * @throws {InternalServerErrorException,HttpException,BadRequestException} If there is an error during task creation.
   */
  async create(createTaskDto: CreateTaskDto, userId: number) {
    const { IssuedToEmail, date, taskName } = createTaskDto;

    const issuedTo = await this.prismaService.user.findUniqueOrThrow({
      where: {
        email: IssuedToEmail
      }
    });
    const issuedBy = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: userId
      }
    });


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
      throw (error)
    }
  }

  /**
* Asynchronously finds all tasks associated with a user.
* 
* This function retrieves all tasks where the user is either the issuer or the assignee.
* It differentiates the tasks issued by the user from those issued to the user.
* 
* @param {number} userId  - The id of the user whose tasks are to be found.
* @returns An object containing two arrays: 'issuedToTheUser' and 'issuedByTheUser'.
* @throws {NotFoundException,HttpException,BadRequestException} If the user with the given id is not found.
*/
  async findAll(userId: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: userId
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
    catch (error) {
      throw (error)
    }
  }

  /**
 * Asynchronously finds a single task by its ID.
 * 
 * This function retrieves a task based on the provided ID. If no task is found,
 * it throws an exception.
 * 
 * @param {number} id - The ID of the task to be retrieved.
 * @returns The task object if found.
 * @throws {NotFoundException,HttpException,BadRequestException} If no task with the given ID is found.
 */
  async findOne(id: number) {
    try {
      const task = await this.prismaService.task.findUnique({
        where: {
          id
        }
      });
      if (!task) {
        throw new NotFoundException('Task not available');
      }
      return task;
    } catch (error) {
      throw (error)
    }

  }

  /**
 * Asynchronously updates an existing task.
 * 
 * This function updates a task with the given ID using the provided task details.
 * If no task is found with the ID, it throws an exception. The function also sets
 * the 'updatedAt' field to the current date and time.
 * 
 * @param {number} id - The ID of the task to be updated.
 * @param {UpdateTaskDto} updateTaskDto - The data transfer object containing updated task details.
 * @returns The updated task object.
 * @throws {NotFoundException} If no task with the given ID is found.
 * @throws {InternalServerErrorException} If there is an error during task update.
 */
  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const { IssuedToEmail, date, taskName, status } = updateTaskDto;

    const task = await this.prismaService.task.findUnique({
      where: {
        id,
        userId 
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
          status,
        }
      });

      return updatedTask;
    } catch (error) {
      throw new InternalServerErrorException('Error in updating task');
    }
  }

  /**
 * Asynchronously removes a task by its ID.
 * 
 * This function deletes a task based on the provided ID. If no task is found,
 * it throws an exception. Upon successful deletion, it returns a confirmation message.
 * 
 * @param {number} id - The ID of the task to be removed.
 * @returns A confirmation message indicating successful removal.
 * @throws {NotFoundException} If no task with the given ID is found.
 * @throws {InternalServerErrorException} If there is an error during task removal.
 */
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
      throw (error)
    }
  }
}
