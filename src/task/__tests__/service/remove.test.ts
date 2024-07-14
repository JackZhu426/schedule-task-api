import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { PrismaService } from "src/prisma/prisma.service";
import { TaskService } from "src/task/task.service";

describe("TaskService/remove", () => {
  let taskService: TaskService;
  let scheduleService: jest.Mocked<ScheduleService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(TaskService)
      .mock(PrismaService)
      .using({
        task: {
          delete: jest.fn()
        }
      })
      .compile();
    taskService = unit;
    prismaService = container.get(PrismaService);
    scheduleService = container.get(ScheduleService);
  });

  it("should successfully delete the corresponding task", async () => {
    const mockDelete = jest.spyOn(prismaService.task, "delete").mockResolvedValue({} as any);

    const res = await taskService.remove("ac6bb267-77b6-466d-812b-0da7552345db");

    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: "ac6bb267-77b6-466d-812b-0da7552345db" }
    });

    expect(res).toEqual({});
  });

  it("should throw error if function failed", async () => {
    const mockDelete = jest.spyOn(prismaService.task, "delete").mockRejectedValue(new Error("error"));

    const errorFn = async () => {
      await taskService.remove("ac6bb267-77b6-466d-812b-0da7552345db");
    };

    await expect(errorFn).rejects.toThrow("error");

    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: "ac6bb267-77b6-466d-812b-0da7552345db" }
    });
  });
});
