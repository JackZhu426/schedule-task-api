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
import { TaskService } from "./task.service";
import { CreateTaskDTO, UpdateTaskDTO } from "./dto/task.dto";
import { ApiCreatedResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TaskEntity } from "./entities/task.entity";

@Controller("task")
@ApiTags("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiCreatedResponse({ type: TaskEntity })
  async create(@Body() createTaskDto: CreateTaskDTO) {
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiResponse({ type: TaskEntity, isArray: true })
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.taskService.findAll(page, limit);
  }

  @Get(":id")
  @ApiResponse({ type: TaskEntity })
  async findOne(@Param("id") id: string) {
    return await this.taskService.findOne(id);
  }

  @Patch(":id")
  @ApiResponse({ type: TaskEntity })
  async update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDTO) {
    return await this.taskService.update(id, updateTaskDto);
  }

  @Delete(":id")
  @ApiResponse({ type: TaskEntity })
  async remove(@Param("id") id: string) {
    return await this.taskService.remove(id);
  }
}
