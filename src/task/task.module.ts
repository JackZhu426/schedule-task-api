import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { ScheduleModule } from "src/schedule/schedule.module";

@Module({
  imports: [ScheduleModule],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
