import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";
import { TaskService } from "src/task/task.service";

describe("TaskService/findOne", () => {
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

  it("should return one task when it exists", async () => {
    const mockFindUnique = jest.spyOn(prismaService.task, "findUnique").mockResolvedValue({} as any);

    const res = await taskService.findOne("ac6bb267-77b6-466d-812b-0da7552345db");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "ac6bb267-77b6-466d-812b-0da7552345db" }
    });

    expect(res).toEqual({});
  });

  it("should throw 'NotFoundException' when task doesn't exist", async () => {
    const mockFindUnique = jest.spyOn(prismaService.task, "findUnique").mockResolvedValue(null);

    const errorFn = async () => {
      await taskService.findOne("wrong-id");
    };

    await expect(errorFn).rejects.toThrow(NotFoundException);
    await expect(errorFn).rejects.toThrow("Task with ID - wrong-id not found");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "wrong-id" }
    });
  });
});
