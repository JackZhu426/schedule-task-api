import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { PrismaService } from "src/prisma/prisma.service";
import { TaskService } from "src/task/task.service";

describe("TaskService/findAll", () => {
  let taskService: TaskService;
  let scheduleService: jest.Mocked<ScheduleService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(TaskService)
      .mock(PrismaService)
      .using({
        task: {
          create: jest.fn()
        }
      })
      .compile();
    taskService = unit;
    prismaService = container.get(PrismaService);
    scheduleService = container.get(ScheduleService);
  });

  it("should return all tasks", async () => {
    const mockFindMany = jest.spyOn(prismaService.task, "findMany").mockResolvedValue([{}] as any);
    const mockCount = jest.spyOn(prismaService.task, "count").mockResolvedValue(1);

    const res = await taskService.findAll(1, 10);

    expect(mockCount).toHaveBeenCalled();
    expect(mockFindMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { accountId: "asc" }
    });

    expect(res).toEqual({
      tasks: [{}],
      metaData: {
        totalTaskCount: 1,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10
      }
    });
  });

  it("should throw error when function failed", async () => {
    const mockCount = jest.spyOn(prismaService.task, "count").mockRejectedValue(new Error("error"));
    const mockFindMany = jest.spyOn(prismaService.task, "findMany").mockResolvedValue([{}] as any);

    const errorFn = async () => {
      await taskService.findAll(1, 10);
    };

    await expect(errorFn).rejects.toThrow(new Error("error"));

    expect(mockCount).toHaveBeenCalled();
    expect(mockFindMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { accountId: "asc" }
    });
  });
});
