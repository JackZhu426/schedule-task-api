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

  async findAll() {
    try {
      // 1. count number of tasks
      const scheduleCount = await this.prismaService.schedule.count();
      // 2. get the pagination from the environment variables
      const limit = +this.configService.get<number>("PAGINATION_SIZE", 100);
      // 3. get the total number of pages
      const totalPages = Math.ceil(scheduleCount / limit);
      // 4. get the tasks based on the pagination
      const totalSchedules = [];
      for (let i = 0; i < totalPages; i++) {
        const schedules = await this.prismaService.schedule.findMany({
          skip: i * limit,
          take: limit,
          orderBy: { id: "asc" }
        });

        totalSchedules.push(...schedules);
      }

      return totalSchedules;
    } catch (error) {
      this.logger.error("Failed to fetch schedules:", error.stack);
      throw new InternalServerErrorException("An error occurred while fetching schedules");
    }
  }

  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid schedule ID - ${id}`);
    }

    try {
      const res = await this.prismaService.schedule.findUnique({ where: { id }, include: { tasks: true } });

      if (!res) {
        throw new NotFoundException(`Schedule with ID - ${id} not found`);
      }

      return res;
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
