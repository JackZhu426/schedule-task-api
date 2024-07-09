import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createTaskDto: Prisma.TaskCreateInput) {
    // TODO: validate the data before creating the task

    return this.prismaService.task.create({ data: createTaskDto });
  }

  findAll() {
    // TODO: add pagination and filtering
    return this.prismaService.task.findMany();
  }

  findOne(id: string) {
    return this.prismaService.task.findUnique({ where: { id } });
  }

  update(id: string, updateTaskDto: Prisma.TaskUpdateInput) {
    return this.prismaService.task.update({ where: { id }, data: updateTaskDto });
  }

  remove(id: string) {
    return this.prismaService.task.delete({ where: { id } });
  }
}
