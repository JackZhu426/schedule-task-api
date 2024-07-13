import { TestBed } from "@automock/jest";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateScheduleDTO } from "src/schedule/dto/schedule.dto";
import { ScheduleService } from "src/schedule/schedule.service";
import MockDate from "mockdate";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("ScheduleService/validateUpdateSchedule", () => {
  let scheduleService: ScheduleService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    MockDate.set("2024-01-02T00:00:00Z");
    const { unit, unitRef: container } = TestBed.create(ScheduleService).compile();
    scheduleService = unit;
    prismaService = container.get(PrismaService);
  });

  it("should throw error when schedule NOT found", async () => {
    const updateScheduleDto: UpdateScheduleDTO = {
      startTime: new Date("2024-01-01T00:00:00Z"),
      endTime: new Date("2024-01-01T01:00:00Z")
    };

    const mockFindOne = jest.spyOn(scheduleService, "findOne").mockResolvedValue(null);

    const errorFn = async () => {
      await scheduleService.validateUpdateSchedule("123", updateScheduleDto);
    };

    expect(errorFn).rejects.toThrow(NotFoundException);
    expect(errorFn).rejects.toThrow("Schedule with ID - 123 not found");

    expect(mockFindOne).toHaveBeenCalledWith("123");
  });

  it("should throw error when start time is in the past", async () => {
    const updateScheduleDto: UpdateScheduleDTO = {
      startTime: new Date("2024-01-01T00:00:00Z"),
      endTime: new Date("2024-01-01T01:00:00Z")
    };

    const mockFindOne = jest.spyOn(scheduleService, "findOne").mockResolvedValue({} as any);

    const errorFn = async () => {
      await scheduleService.validateUpdateSchedule("123", updateScheduleDto);
    };

    expect(errorFn).rejects.toThrow(BadRequestException);
    expect(errorFn).rejects.toThrow("Start time cannot be in the past");

    expect(mockFindOne).toHaveBeenCalledWith("123");
  });

  it("should throw error when schedule end time is earlier than schedule start time", async () => {
    const updateScheduleDto: UpdateScheduleDTO = {
      startTime: new Date("2024-01-04T00:00:00Z"),
      endTime: new Date("2024-01-03T01:00:00Z")
    };

    const mockFindOne = jest.spyOn(scheduleService, "findOne").mockResolvedValue({} as any);

    const errorFn = async () => {
      await scheduleService.validateUpdateSchedule("123", updateScheduleDto);
    };

    expect(errorFn).rejects.toThrow(BadRequestException);
    expect(errorFn).rejects.toThrow("End time cannot be before start time");

    expect(mockFindOne).toHaveBeenCalledWith("123");
  });

  it("should NOT throw error if 'startTime' and 'endTime' not passed in", async () => {
    const updateScheduleDto: UpdateScheduleDTO = {};

    const mockFindOne = jest.spyOn(scheduleService, "findOne").mockResolvedValue({} as any);

    await scheduleService.validateUpdateSchedule("123", updateScheduleDto);

    expect(mockFindOne).toHaveBeenCalledWith("123");
  });
});
