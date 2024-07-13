import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateScheduleDTO } from "src/schedule/dto/schedule.dto";

describe("ScheduleService/create", () => {
  let scheduleService: ScheduleService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleService)
      .mock(PrismaService)
      .using({
        schedule: {
          create: jest.fn()
        }
      })
      .compile();
    scheduleService = unit;
    prismaService = container.get(PrismaService);
  });

  it("should successfully create the schedule (NO tasks)", async () => {
    const createScheduleDto: CreateScheduleDTO = {
      accountId: 123,
      agentId: 456,
      startTime: new Date("2024-01-01T00:00:00Z"),
      endTime: new Date("2024-01-01T01:00:00Z")
    };

    jest.spyOn(scheduleService, "validateCreateSchedule").mockImplementation();

    const mockCreate = jest.spyOn(prismaService.schedule, "create").mockResolvedValue({} as any);

    const res = await scheduleService.create(createScheduleDto);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        accountId: 123,
        agentId: 456,
        startTime: new Date("2024-01-01T00:00:00Z"),
        endTime: new Date("2024-01-01T01:00:00Z"),
        tasks: undefined
      }
    });

    expect(res).toEqual({});
  });

  it("should successfully create the schedule (with tasks)", async () => {
    const createScheduleDto: CreateScheduleDTO = {
      accountId: 123,
      agentId: 456,
      startTime: new Date("2024-01-01T00:00:00Z"),
      endTime: new Date("2024-01-01T01:00:00Z"),
      tasks: []
    };

    jest.spyOn(scheduleService, "validateCreateSchedule").mockImplementation();

    const mockCreate = jest.spyOn(prismaService.schedule, "create").mockResolvedValue({} as any);

    const res = await scheduleService.create(createScheduleDto);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        accountId: 123,
        agentId: 456,
        startTime: new Date("2024-01-01T00:00:00Z"),
        endTime: new Date("2024-01-01T01:00:00Z"),
        tasks: {
          create: []
        }
      }
    });

    expect(res).toEqual({});
  });

  it("should throw error when create failed", async () => {
    const createScheduleDto: CreateScheduleDTO = {
      accountId: 123,
      agentId: 456,
      startTime: new Date("2024-01-01T00:00:00Z"),
      endTime: new Date("2024-01-01T01:00:00Z"),
      tasks: []
    };

    jest.spyOn(scheduleService, "validateCreateSchedule").mockImplementation();

    const mockCreate = jest.spyOn(prismaService.schedule, "create").mockRejectedValue(new Error("Failed to create"));

    const errorFn = async () => {
      await scheduleService.create(createScheduleDto);
    };

    await expect(errorFn).rejects.toThrow("Failed to create");

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        accountId: 123,
        agentId: 456,
        startTime: new Date("2024-01-01T00:00:00Z"),
        endTime: new Date("2024-01-01T01:00:00Z"),
        tasks: {
          create: []
        }
      }
    });
  });
});
