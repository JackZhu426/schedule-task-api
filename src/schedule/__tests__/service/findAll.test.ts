import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { PrismaService } from "src/prisma/prisma.service";

describe("ScheduleService/findAll", () => {
  let scheduleService: ScheduleService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleService)
      .mock(PrismaService)
      .using({
        schedule: {
          findMany: jest.fn(),
          count: jest.fn()
        }
      })
      .compile();
    scheduleService = unit;
    prismaService = container.get(PrismaService);
  });

  it("should return all schedules", async () => {
    const mockFindMany = jest.spyOn(prismaService.schedule, "findMany").mockResolvedValue([{}] as any);
    const mockCount = jest.spyOn(prismaService.schedule, "count").mockResolvedValue(1);

    const res = await scheduleService.findAll(1, 10);

    expect(mockCount).toHaveBeenCalled();
    expect(mockFindMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { accountId: "asc" },
      include: { tasks: true }
    });

    expect(res).toEqual({
      schedules: [{}],
      metaData: {
        totalScheduleCount: 1,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10
      }
    });
  });

  it("should throw error when function failed", async () => {
    const mockCount = jest.spyOn(prismaService.schedule, "count").mockRejectedValue(new Error("error"));
    const mockFindMany = jest.spyOn(prismaService.schedule, "findMany").mockResolvedValue([{}] as any);

    const errorFn = async () => {
      await scheduleService.findAll(1, 10);
    };

    await expect(errorFn).rejects.toThrow(new Error("error"));

    expect(mockCount).toHaveBeenCalled();
    expect(mockFindMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { accountId: "asc" },
      include: { tasks: true }
    });
  });
});
