import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { PrismaService } from "src/prisma/prisma.service";

describe("ScheduleService/remove", () => {
  let scheduleService: ScheduleService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleService)
      .mock(PrismaService)
      .using({
        schedule: {
          delete: jest.fn()
        }
      })
      .compile();
    scheduleService = unit;
    prismaService = container.get(PrismaService);
  });

  it("should successfully delete the corresponding schedule", async () => {
    const mockDelete = jest.spyOn(prismaService.schedule, "delete").mockResolvedValue({} as any);

    const res = await scheduleService.remove("ac6bb267-77b6-466d-812b-0da7552345db");

    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: "ac6bb267-77b6-466d-812b-0da7552345db" }
    });

    expect(res).toEqual({});
  });

  it("should throw error if function failed", async () => {
    const mockDelete = jest.spyOn(prismaService.schedule, "delete").mockRejectedValue(new Error("error"));

    const errorFn = async () => {
      await scheduleService.remove("ac6bb267-77b6-466d-812b-0da7552345db");
    };

    await expect(errorFn).rejects.toThrow("error");

    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: "ac6bb267-77b6-466d-812b-0da7552345db" }
    });
  });
});
