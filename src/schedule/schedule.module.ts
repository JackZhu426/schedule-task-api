import { Module } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { ScheduleController } from "./schedule.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService]
})
export class ScheduleModule {}
