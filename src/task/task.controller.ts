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

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDTO) {
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.taskService.findAll(page, limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.taskService.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDTO) {
    return await this.taskService.update(id, updateTaskDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.taskService.remove(id);
  }
}
