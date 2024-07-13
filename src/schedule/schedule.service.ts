import { Injectable, Logger, BadRequestException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateScheduleDTO, UpdateScheduleDTO } from "./dto/schedule.dto";

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(createScheduleDto: CreateScheduleDTO) {
    // Validate: 1) global validation (ValidationPipe in main.ts), 2) custom validation
    await this.validateCreateSchedule(createScheduleDto);

    const { accountId, agentId, startTime, endTime, tasks } = createScheduleDto;

    try {
      // Transform: the input DTO to Prisma data model
      const scheduleData: Prisma.ScheduleCreateInput = {
        accountId,
        agentId,
        startTime,
        endTime,
        tasks: tasks ? { create: tasks } : undefined
      };

      return await this.prismaService.schedule.create({ data: scheduleData });
    } catch (error) {
      this.logger.error("Failed to create schedule:", error.stack);

      throw error;
    }
  }

  async validateCreateSchedule(schedule: CreateScheduleDTO): Promise<void> {
    // Additional custom validations: 👇🏻

    // 1. 'startTime' must be in the future
    if (schedule.startTime < new Date()) {
      throw new BadRequestException("Start time cannot be in the past");
    }

    // 2. 'endTime' must be after 'startTime'
    if (schedule.endTime < schedule.startTime) {
      throw new BadRequestException("End time cannot be before start time");
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

      const [totalScheduleCount, schedules] = await Promise.all([
        this.prismaService.schedule.count(),
        this.prismaService.schedule.findMany({
          skip,
          take: limit,
          orderBy: { accountId: "asc" },
          include: { tasks: true }
        })
      ]);

      const totalPages = Math.ceil(totalScheduleCount / limit);

      return {
        schedules,
        metaData: {
          totalScheduleCount,
          totalPages,
          currentPage: page,
          pageSize: limit
        }
      };
    } catch (error) {
      this.logger.error("Failed to fetch schedules:", error.stack);

      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const schedule = await this.prismaService.schedule.findUnique({ where: { id }, include: { tasks: true } });

      if (!schedule) {
        throw new NotFoundException(`Schedule with ID - ${id} not found`);
      }

      return schedule;
    } catch (error) {
      this.logger.error("Failed to fetch schedule:", error.stack);

      throw error;
    }
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDTO) {
    // Validate: 1) global validation (ValidationPipe in main.ts), 2) custom validation
    await this.validateUpdateSchedule(id, updateScheduleDto);

    // Transform: the input DTO to Prisma data model
    const scheduleData = this.transformScheduleUpdateInput(updateScheduleDto);

    try {
      return await this.prismaService.schedule.update({
        where: { id },
        data: scheduleData
      });
    } catch (error) {
      this.logger.error("Failed to update schedule:", error.stack);

      throw error;
    }
  }

  transformScheduleUpdateInput(updateScheduleDto: UpdateScheduleDTO): Prisma.ScheduleUpdateInput {
    const { accountId, agentId, startTime, endTime } = updateScheduleDto;

    // Transform: the input DTO to Prisma data model
    const scheduleData: Prisma.ScheduleUpdateInput = {};

    if (accountId) {
      scheduleData.accountId = accountId;
    }

    if (agentId) {
      scheduleData.agentId = agentId;
    }

    if (startTime) {
      scheduleData.startTime = startTime;
    }

    if (endTime) {
      scheduleData.endTime = endTime;
    }

    return scheduleData;
  }

  async validateUpdateSchedule(id: string, updateTaskDto: UpdateScheduleDTO) {
    const schedule = await this.findOne(id);

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID - ${id} not found`);
    }

    const { startTime: newScheduleStartTime, endTime: newScheduleEndTime } = updateTaskDto;

    // 1. 'startTime' must be in the future
    if (newScheduleStartTime && newScheduleStartTime < new Date()) {
      throw new BadRequestException("Start time cannot be in the past");
    }

    // 2. 'endTime' must be after 'startTime'
    if (newScheduleEndTime && newScheduleEndTime < newScheduleStartTime) {
      throw new BadRequestException("End time cannot be before start time");
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.schedule.delete({ where: { id } });
    } catch (error) {
      this.logger.error("Failed to delete schedule:", error.stack);

      throw error;
    }
  }
}
