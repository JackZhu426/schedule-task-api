import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe
} from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { CreateScheduleDTO, UpdateScheduleDTO } from "./dto/schedule.dto";

@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDTO) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.scheduleService.findAll(page, limit);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.scheduleService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateScheduleDto: UpdateScheduleDTO) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.scheduleService.remove(id);
  }
}
