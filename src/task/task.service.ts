import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
  NotFoundException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDTO, UpdateTaskDTO } from "./dto/task.dto";
import { isUUID, validate } from "class-validator";
import { ScheduleService } from "src/schedule/schedule.service";

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly scheduleService: ScheduleService
  ) {}

  async create(createTaskDto: CreateTaskDTO) {
    // Validate: 1) global validation (ValidationPipe in main.ts), 2) custom validation
    await this.validateCreateTask(createTaskDto);

    const { accountId, startTime, duration, type, scheduleId } = createTaskDto;

    const taskData: Prisma.TaskCreateInput = {
      accountId,
      startTime,
      duration,
      type,
      schedule: {
        connect: { id: scheduleId }
      }
    };

    try {
      return await this.prismaService.task.create({ data: taskData });
    } catch (error) {
      this.logger.error("Failed to create task:", error.stack);

      console.log("error code:", error.code);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed
        if (error.code === "P2002") {
          throw new BadRequestException("A task with these details already exists");
        } else if (error.code === "P2003" || error.code === "P2025") {
          // P2003/P2025: Foreign key constraint failed
          throw new BadRequestException(
            `The specified schedule - scheduleId: ${createTaskDto.scheduleId} does not exist`
          );
        }
      }

      throw new InternalServerErrorException("Failed to create task");
    }
  }

  private async validateCreateTask(task: CreateTaskDTO): Promise<void> {
    const errors = await validate(task);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const { scheduleId, startTime: taskStartTime, duration: taskDuration } = task;

    // Additional custom validations
    // 1. input 'duration' must be positive
    if (taskDuration <= 0) {
      throw new BadRequestException("Duration must be positive");
    }

    // 2. 'startTime' must be in the future
    if (taskStartTime < new Date()) {
      throw new BadRequestException("Start time cannot be in the past");
    }

    try {
      const schedule = await this.scheduleService.findOne(scheduleId);

      // 3. 'schedule' must exist - i.e. 'scheduleId' must be valid
      if (!schedule) {
        throw new BadRequestException(`Schedule with ID - ${scheduleId} not found! Please input the right schedule ID`);
      }

      const { startTime: scheduleStartTime, endTime: scheduleEndTime } = schedule;

      // 4. 'task' start time must be after 'schedule' start time
      if (taskStartTime < scheduleStartTime) {
        throw new BadRequestException("'Task' start time cannot be before 'Schedule' start time");
      }

      // 5. 'task' end time must be before 'schedule' end time
      if (taskStartTime.getTime() + taskDuration > scheduleEndTime.getTime()) {
        throw new BadRequestException("'Task' end time cannot be after 'Schedule' end time");
      }
    } catch (error) {
      throw error;
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

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid task ID - ${id}`);
    }
    try {
      const task = await this.prismaService.task.findUnique({ where: { id } });

      if (!task) {
        throw new NotFoundException(`Task with ID - ${id} not found`);
      }

      return task;
    } catch (error) {
      this.logger.error("Failed to fetch task:", error.stack);

      // catch 'NotFoundException' and re-throw it
      if (error instanceof NotFoundException) {
        throw error;
      }

      // throw 'InternalServerErrorException' for all other errors
      throw new InternalServerErrorException(`An error occurred while fetching task with ID - ${id}`);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDTO) {
    // TODO: Validate: 1) global validation (ValidationPipe in main.ts), 2) custom validation
    await this.validateUpdateTask(updateTaskDto);

    const { accountId, startTime, duration, type, scheduleId } = updateTaskDto;

    const taskData: Prisma.TaskCreateInput = {
      accountId,
      startTime,
      duration,
      type,
      schedule: {
        connect: { id: scheduleId }
      }
    };

    try {
      return await this.prismaService.task.update({ where: { id }, data: taskData });
    } catch (error) {
      this.logger.error("Failed to create task:", error.stack);

      console.log("error code:", error.code);

      if (error.code === "P2003" || error.code === "P2025") {
        // P2003/P2025: Foreign key constraint failed
        throw new BadRequestException(
          `The specified schedule - scheduleId: ${updateTaskDto.scheduleId} does not exist`
        );
      }

      throw new InternalServerErrorException("Failed to update task");
    }
  }

  private async validateUpdateTask(task: UpdateTaskDTO): Promise<void> {
    const errors = await validate(task);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const { scheduleId, startTime: taskStartTime, duration: taskDuration } = task;

    // Additional custom validations
    // 1. input 'duration' must be positive
    if (taskDuration <= 0) {
      throw new BadRequestException("Duration must be positive");
    }

    // 2. 'startTime' must be in the future
    if (taskStartTime < new Date()) {
      throw new BadRequestException("Start time cannot be in the past");
    }

    try {
      const schedule = await this.scheduleService.findOne(scheduleId);

      // 3. 'schedule' must exist - i.e. 'scheduleId' must be valid
      if (!schedule) {
        throw new BadRequestException(`Schedule with ID - ${scheduleId} not found! Please input the right schedule ID`);
      }

      const { startTime: scheduleStartTime, endTime: scheduleEndTime } = schedule;

      // 4. 'task' start time must be after 'schedule' start time
      if (taskStartTime < scheduleStartTime) {
        throw new BadRequestException("'Task' start time cannot be before 'Schedule' start time");
      }

      // 5. 'task' end time must be before 'schedule' end time
      if (taskStartTime.getTime() + taskDuration > scheduleEndTime.getTime()) {
        throw new BadRequestException("'Task' end time cannot be after 'Schedule' end time");
      }
    } catch (error) {
      throw error;
    }
  }

  // TODO: Implement the 'remove' method
  async remove(id: string) {
    return await this.prismaService.task.delete({ where: { id } });
  }
}
