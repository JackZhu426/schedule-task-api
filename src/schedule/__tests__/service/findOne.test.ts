import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

describe("ScheduleService/findOne", () => {
  let scheduleService: ScheduleService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleService)
      .mock(PrismaService)
      .using({
        schedule: {
          findUnique: jest.fn()
        }
      })
      .compile();
    scheduleService = unit;
    prismaService = container.get(PrismaService);
  });

  it("should return one schedule when it exists", async () => {
    const mockFindUnique = jest.spyOn(prismaService.schedule, "findUnique").mockResolvedValue({} as any);

    const res = await scheduleService.findOne("ac6bb267-77b6-466d-812b-0da7552345db");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "ac6bb267-77b6-466d-812b-0da7552345db" },
      include: { tasks: true }
    });

    expect(res).toEqual({});
  });

  it("should throw 'NotFoundException' when schedule doesn't exist", async () => {
    const mockFindUnique = jest.spyOn(prismaService.schedule, "findUnique").mockResolvedValue(null);

    const errorFn = async () => {
      await scheduleService.findOne("wrong-id");
    };

    await expect(errorFn).rejects.toThrow(NotFoundException);
    await expect(errorFn).rejects.toThrow("Schedule with ID - wrong-id not found");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "wrong-id" },
      include: { tasks: true }
    });
  });
});
