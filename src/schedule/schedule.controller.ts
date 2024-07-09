import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { Prisma } from "@prisma/client";

@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: Prisma.ScheduleCreateInput) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.scheduleService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateScheduleDto: Prisma.ScheduleUpdateInput) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.scheduleService.remove(id);
  }
}
