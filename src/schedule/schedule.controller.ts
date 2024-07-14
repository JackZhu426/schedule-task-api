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
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { ScheduleEntity } from "./entities/schedule.entity";

@Controller("schedule")
@ApiTags("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiCreatedResponse({ type: ScheduleEntity })
  async create(@Body() createScheduleDto: CreateScheduleDTO) {
    return await this.scheduleService.create(createScheduleDto);
  }

  @Get()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.scheduleService.findAll(page, limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.scheduleService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateScheduleDto: UpdateScheduleDTO) {
    return await this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.scheduleService.remove(id);
  }
}
