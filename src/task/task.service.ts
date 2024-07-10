import { Injectable, InternalServerErrorException, Logger, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, Task } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDTO } from "./dto/task.dto";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async create(createTaskDto: CreateTaskDTO) {
    // TODO: validate the data before creating the task
    try {
      const taskData: Prisma.TaskCreateInput = {
        accountId: createTaskDto.accountId,
        startTime: createTaskDto.startTime,
        duration: createTaskDto.duration,
        type: createTaskDto.type,
        schedule: {
          connect: { id: createTaskDto.scheduleId }
        }
      };

      await this.prismaService.task.create({ data: taskData });
    } catch (error) {
      this.logger.error("Failed to create task:", error.stack);

      console.log("error code:", error.code);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed
        if (error.code === "P2002") {
          throw new BadRequestException("A task with these details already exists");
        } else if (error.code === "P2003" || error.code === "P2025") {
          // P2003: Foreign key constraint failed
          throw new BadRequestException(
            `The specified schedule - scheduleId: ${createTaskDto.scheduleId} does not exist`
          );
        }
      }

      throw new BadRequestException("Failed to create task");
    }
  }

  async findAll() {
    try {
      // 1. count number of tasks
      const taskCount = await this.prismaService.task.count();
      console.log("task count:", taskCount);
      // 2. get the pagination from the environment variables
      const limit = +this.configService.get<number>("PAGINATION_SIZE", 100);
      // 3. get the total number of pages
      const totalPages = Math.ceil(taskCount / limit);
      console.log("total pages:", totalPages);
      // 4. get the tasks based on the pagination
      const totalTasks = [];
      for (let i = 0; i < totalPages; i++) {
        const tasks = await this.prismaService.task.findMany({
          skip: i * limit,
          take: limit
        });

        totalTasks.push(...tasks);
      }

      return totalTasks;
    } catch (error) {
      this.logger.error("Failed to fetch tasks:", error.stack);
      throw new InternalServerErrorException("An error occurred while fetching tasks");
    }
  }

  findOne(id: string) {
    return this.prismaService.task.findUnique({ where: { id } });
  }

  update(id: string, updateTaskDto: Prisma.TaskUpdateInput) {
    return this.prismaService.task.update({ where: { id }, data: updateTaskDto });
  }

  remove(id: string) {
    return this.prismaService.task.delete({ where: { id } });
  }
}
