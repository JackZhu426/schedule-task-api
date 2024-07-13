import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { CreateScheduleDTO } from "./dto/schedule.dto";
import { isUUID, validate } from "class-validator";

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async create(createScheduleDto: CreateScheduleDTO) {
    // Validate: 1) global validation (ValidationPipe in main.ts), 2) custom validation
    await this.validateCreateSchedule(createScheduleDto);

    const { accountId, agentId, startTime, endTime, tasks } = createScheduleDto;

    try {
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

      console.log("error code:", error.code);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed
        if (error.code === "P2002") {
          throw new BadRequestException("A schedule with these details already exists");
        }
      }

      throw new BadRequestException("Failed to create schedule");
    }
  }

  private async validateCreateSchedule(schedule: CreateScheduleDTO): Promise<void> {
    const errors = await validate(schedule);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Additional custom validations
    if (schedule.startTime < new Date()) {
      throw new BadRequestException("Start time cannot be in the past");
    }

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
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid schedule ID - ${id}`);
    }

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

  async update(id: string, updateScheduleDto: Prisma.ScheduleUpdateInput) {
    // TODO: validate the data before updating the schedule

    return this.prismaService.schedule.update({
      where: { id },
      data: updateScheduleDto
    });
  }

  async remove(id: string) {
    return this.prismaService.schedule.delete({ where: { id } });
  }
}
