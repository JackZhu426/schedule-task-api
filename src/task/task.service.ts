import { Injectable, Logger, BadRequestException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDTO, UpdateTaskDTO } from "./dto/task.dto";
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

      throw error;
    }
  }

  async validateCreateTask(task: CreateTaskDTO): Promise<void> {
    const { scheduleId, startTime: taskStartTime, duration: taskDuration } = task;

    // Additional custom validations: 👇🏻

    // 1. 'startTime' must be in the future
    if (taskStartTime < new Date()) {
      throw new BadRequestException("Start time cannot be in the past");
    }

    const schedule = await this.scheduleService.findOne(scheduleId);

    // 2. 'schedule' must exist - i.e. 'scheduleId' must be valid
    if (!schedule) {
      throw new BadRequestException(`Schedule with ID - ${scheduleId} not found`);
    }

    const { endTime: scheduleEndTime } = schedule;

    // 3. 'task' end time must be before 'schedule' end time
    if (taskStartTime.getTime() + taskDuration * 1000 > scheduleEndTime.getTime()) {
      throw new BadRequestException("'Task' end time cannot be after 'Schedule' end time");
    }
  }

  async findAll(page: number, limit: number) {
    try {
      // Ensure 'page' and 'limit' are positive integers
      page = Math.max(1, page);
      limit = Math.max(1, Math.min(100, limit));

      const skip = (page - 1) * limit;

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
    await this.validateUpdateTask(id, updateTaskDto);

    // Transform: the input DTO to Prisma data model
    const taskData = this.transformTaskUpdateInput(updateTaskDto);

    try {
      return await this.prismaService.task.update({ where: { id }, data: taskData });
    } catch (error) {
      this.logger.error("Failed to update task:", error.stack);

      throw error;
    }
  }

  transformTaskUpdateInput(updateTaskDto: UpdateTaskDTO): Prisma.TaskUpdateInput {
    const { accountId, startTime, duration, type, scheduleId } = updateTaskDto;

    // Transform: the input DTO to Prisma data model
    const taskData: Prisma.TaskUpdateInput = {};

    if (accountId) {
      taskData.accountId = accountId;
    }

    if (startTime) {
      taskData.startTime = startTime;
    }

    if (duration) {
      taskData.duration = duration;
    }

    if (type) {
      taskData.type = type;
    }

    if (scheduleId) {
      taskData.schedule = {
        connect: { id: scheduleId }
      };
    }

    return taskData;
  }

  async validateUpdateTask(id: string, updateTaskDto: UpdateTaskDTO): Promise<void> {
    const task = await this.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with ID - ${id} not found`);
    }

    const { scheduleId: newScheduleId, startTime: newTaskStartTime, duration: newTaskDuration } = updateTaskDto;

    // Additional custom validations: 👇🏻

    // 1. 'startTime' must be in the future
    if (newTaskStartTime && newTaskStartTime < new Date()) {
      throw new BadRequestException("Start time cannot be in the past");
    }

    const currentScheduleId = newScheduleId || task.scheduleId;

    const schedule = await this.scheduleService.findOne(currentScheduleId);

    // 2. 'schedule' must exist - i.e. 'scheduleId' must be valid
    if (!schedule) {
      throw new BadRequestException(`Schedule with ID - ${newScheduleId} not found`);
    }

    const { endTime: scheduleEndTime } = schedule;

    // 3. 'task' end time must be before 'schedule' end time
    const startTime = newTaskStartTime || task.startTime;
    const duration = newTaskDuration || task.duration;
    const taskEndTime = new Date(startTime.getTime() + duration * 1000);

    if (taskEndTime > scheduleEndTime) {
      throw new BadRequestException("'Task' end time cannot be after 'Schedule' end time");
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.task.delete({ where: { id } });
    } catch (error) {
      this.logger.error("Failed to delete task:", error.stack);

      throw error;
    }
  }
}
