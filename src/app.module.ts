import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { TaskModule } from './task/task.module';

@Module({
  imports: [PrismaModule, ScheduleModule, TaskModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
