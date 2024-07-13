import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateScheduleDTO } from "src/schedule/dto/schedule.dto";

describe("ScheduleService/update", () => {
  let scheduleService: ScheduleService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleService)
      .mock(PrismaService)
      .using({
        schedule: {
          update: jest.fn()
        }
      })
      .compile();
    scheduleService = unit;
    prismaService = container.get(PrismaService);
  });

  it("should successfully update the schedule", async () => {
    const updateScheduleDto: UpdateScheduleDTO = {
      accountId: 123
    };

    jest.spyOn(scheduleService, "validateUpdateSchedule").mockImplementation();

    const mockUpdate = jest.spyOn(prismaService.schedule, "update").mockResolvedValue({} as any);

    const res = await scheduleService.update("123", updateScheduleDto);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "123" },
      data: {
        accountId: 123
      }
    });

    expect(res).toEqual({});
  });

  it("should throw error when update failed", async () => {
    const updateScheduleDto: UpdateScheduleDTO = {
      accountId: 123
    };
    jest.spyOn(scheduleService, "validateUpdateSchedule").mockImplementation();

    const mockError = new Error("Failed to update");

    const mockUpdate = jest.spyOn(prismaService.schedule, "update").mockRejectedValue(mockError);

    const errorFn = async () => {
      await scheduleService.update("123", updateScheduleDto);
    };

    await expect(errorFn).rejects.toThrow(Error);
    await expect(errorFn).rejects.toThrow("Failed to update");

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "123" },
      data: {
        accountId: 123
      }
    });
  });
});
