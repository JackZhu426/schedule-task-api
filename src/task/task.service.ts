import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
  NotFoundException
} from "@nestjs/common";
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
    private readonly scheduleService: ScheduleService
  ) {}

  async create(createTaskDto: CreateTaskDTO) {
    // Validate: 1) global validation (ValidationPipe in main.ts), 2) custom validation
    await this.validateCreateTask(createTaskDto);

    const { accountId, startTime, duration, type, scheduleId } = createTaskDto;

    // Transform: the input DTO to Prisma data model
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

      throw error;
    }
  }

  private async validateCreateTask(task: CreateTaskDTO): Promise<void> {
    const errors = await validate(task);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const { scheduleId, startTime: taskStartTime, duration: taskDuration } = task;

    // Additional custom validations: 👇🏻

    // 1. 'startTime' must be in the future
    if (taskStartTime < new Date()) {
      throw new BadRequestException("Start time cannot be in the past");
    }

    const schedule = await this.scheduleService.findOne(scheduleId);

    // 2. 'schedule' must exist - i.e. 'scheduleId' must be valid
    if (!schedule) {
      throw new BadRequestException(`Schedule with ID - ${scheduleId} not found! Please input the right schedule ID`);
    }

    const { startTime: scheduleStartTime, endTime: scheduleEndTime } = schedule;

    // 3. 'task' start time must be after 'schedule' start time
    if (taskStartTime < scheduleStartTime) {
      throw new BadRequestException("'Task' start time cannot be before 'Schedule' start time");
    }

    // 4. 'task' end time must be before 'schedule' end time
    if (taskStartTime.getTime() + taskDuration > scheduleEndTime.getTime()) {
      throw new BadRequestException("'Task' end time cannot be after 'Schedule' end time");
    }
  }

  async findAll(page: number, limit: number) {
    try {
      // Ensure 'page' and 'limit' are positive integers
      page = Math.max(1, page);
      limit = Math.max(1, Math.min(100, limit));

      const skip = (page - 1) * limit;

      console.log("page:", page);

      console.log("limit:", limit);

      const [totalTaskCount, tasks] = await Promise.all([
        this.prismaService.task.count(),
        this.prismaService.task.findMany({ skip, take: limit, orderBy: { accountId: "asc" } })
      ]);

      const totalPages = Math.ceil(totalTaskCount / limit);

      return {
        tasks,
        metaData: {
          totalTaskCount,
          totalPages,
          currentPage: page,
          pageSize: limit
        }
      };
    } catch (error) {
      this.logger.error("Failed to fetch tasks:", error.stack);

      throw error;
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

      throw error;
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDTO) {
    // Validate: 1) global validation (ValidationPipe in main.ts), 2) custom validation
    await this.validateUpdateTask(updateTaskDto);

    const { accountId, startTime, duration, type, scheduleId } = updateTaskDto;

    // Transform: the input DTO to Prisma data model
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
      this.logger.error("Failed to update task:", error.stack);

      throw error;
    }
  }

  private async validateUpdateTask(task: UpdateTaskDTO): Promise<void> {
    const errors = await validate(task);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const { scheduleId, startTime: taskStartTime, duration: taskDuration } = task;

    // Additional custom validations: 👇🏻

    // 1. 'startTime' must be in the future
    if (taskStartTime < new Date()) {
      throw new BadRequestException("Start time cannot be in the past");
    }

    const schedule = await this.scheduleService.findOne(scheduleId);

    // 2. 'schedule' must exist - i.e. 'scheduleId' must be valid
    if (!schedule) {
      throw new BadRequestException(`Schedule with ID - ${scheduleId} not found! Please input the right schedule ID`);
    }

    const { startTime: scheduleStartTime, endTime: scheduleEndTime } = schedule;

    // 3. 'task' start time must be after 'schedule' start time
    if (taskStartTime < scheduleStartTime) {
      throw new BadRequestException("'Task' start time cannot be before 'Schedule' start time");
    }

    // 4. 'task' end time must be before 'schedule' end time
    if (taskStartTime.getTime() + taskDuration > scheduleEndTime.getTime()) {
      throw new BadRequestException("'Task' end time cannot be after 'Schedule' end time");
    }
  }

  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid task ID - ${id}`);
    }
    try {
      return await this.prismaService.task.delete({ where: { id } });
    } catch (error) {
      this.logger.error("Failed to delete task:", error.stack);

      throw error;
    }
  }
}
