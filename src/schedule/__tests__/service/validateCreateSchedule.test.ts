import { TestBed } from "@automock/jest";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateScheduleDTO } from "src/schedule/dto/schedule.dto";
import { ScheduleService } from "src/schedule/schedule.service";
import MockDate from "mockdate";
import { BadRequestException } from "@nestjs/common";

describe("ScheduleService/validateCreateSchedule", () => {
  let scheduleService: ScheduleService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    MockDate.set("2024-01-02T00:00:00Z");
    const { unit, unitRef: container } = TestBed.create(ScheduleService).compile();
    scheduleService = unit;
    prismaService = container.get(PrismaService);
  });

  it("should throw error when start time is in the past", async () => {
    const createScheduleDto: CreateScheduleDTO = {
      accountId: 123,
      agentId: 456,
      startTime: new Date("2024-01-01T00:00:00Z"),
      endTime: new Date("2024-01-01T01:00:00Z")
    };

    const errorFn = async () => {
      await scheduleService.validateCreateSchedule(createScheduleDto);
    };

    expect(errorFn).rejects.toThrow(BadRequestException);
    expect(errorFn).rejects.toThrow("Start time cannot be in the past");
  });

  it("should throw error when schedule end time is earlier than schedule start time", async () => {
    const createScheduleDto: CreateScheduleDTO = {
      accountId: 123,
      agentId: 456,
      startTime: new Date("2024-01-04T00:00:00Z"),
      endTime: new Date("2024-01-03T01:00:00Z")
    };

    const errorFn = async () => {
      await scheduleService.validateCreateSchedule(createScheduleDto);
    };

    expect(errorFn).rejects.toThrow(BadRequestException);
    expect(errorFn).rejects.toThrow("End time cannot be before start time");
  });
});
