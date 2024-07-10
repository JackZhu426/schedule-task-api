import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { TaskService } from "./task.service";
import { Prisma } from "@prisma/client";
import { CreateTaskDTO } from "./dto/task.dto";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDTO) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTaskDto: Prisma.TaskUpdateInput) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.taskService.remove(id);
  }
}
