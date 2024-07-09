import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createScheduleDto: Prisma.ScheduleCreateInput) {
    // TODO: validate the data before creating the schedule

    return this.prismaService.schedule.create({ data: createScheduleDto });
  }

  findAll() {
    // TODO: add pagination and filtering
    return this.prismaService.schedule.findMany();
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
