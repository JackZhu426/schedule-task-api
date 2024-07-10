import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { TaskModule } from "./task/task.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [PrismaModule, ScheduleModule, TaskModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
