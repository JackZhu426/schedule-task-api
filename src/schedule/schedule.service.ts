import { Injectable, Logger, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  create(createScheduleDto: Prisma.ScheduleCreateInput) {
    // TODO: validate the data before creating the schedule

    try {
      return this.prismaService.schedule.create({ data: createScheduleDto });
    } catch (error) {
      this.logger.error(error);
      return error;
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

  findOne(id: string) {
    return this.prismaService.schedule.findUnique({ where: { id }, include: { tasks: true } });
  }

  update(id: string, updateScheduleDto: Prisma.ScheduleUpdateInput) {
    // TODO: validate the data before updating the schedule

    return this.prismaService.schedule.update({
      where: { id },
      data: updateScheduleDto
    });
  }

  remove(id: string) {
    return this.prismaService.schedule.delete({ where: { id } });
  }
}
