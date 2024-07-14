import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { PrismaService } from "src/prisma/prisma.service";
import { TaskService } from "src/task/task.service";
import { UpdateTaskDTO } from "src/task/dto/task.dto";

describe("TaskService/update", () => {
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

  it("should successfully update the task", async () => {
    const updateScheduleDto: UpdateTaskDTO = {
      accountId: 123
    };

    jest.spyOn(taskService, "validateUpdateTask").mockImplementation();

    const mockUpdate = jest.spyOn(prismaService.task, "update").mockResolvedValue({} as any);

    const res = await taskService.update("123", updateScheduleDto);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "123" },
      data: {
        accountId: 123
      }
    });

    expect(res).toEqual({});
  });

  it("should throw error when update failed", async () => {
    const updateScheduleDto: UpdateTaskDTO = {
      accountId: 123
    };
    jest.spyOn(taskService, "validateUpdateTask").mockImplementation();

    const mockError = new Error("Failed to update");

    const mockUpdate = jest.spyOn(prismaService.task, "update").mockRejectedValue(mockError);

    const errorFn = async () => {
      await taskService.update("123", updateScheduleDto);
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
