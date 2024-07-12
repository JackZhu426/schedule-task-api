import { Test, TestingModule } from "@nestjs/testing";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

const mockScheduleService = {};

describe("ScheduleController", () => {
  let controller: ScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [{ provide: ScheduleService, useValue: mockScheduleService }]
    })
      .overrideProvider(ScheduleService)
      .useValue(mockScheduleService)
      .overrideProvider(PrismaService)
      .useValue(mockScheduleService)
      .overrideProvider(ConfigService)
      .useValue(mockScheduleService)
      .compile();

    controller = module.get<ScheduleController>(ScheduleController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
