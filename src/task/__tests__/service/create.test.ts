import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { PrismaService } from "src/prisma/prisma.service";
import { TaskService } from "src/task/task.service";
import { CreateTaskDTO } from "src/task/dto/task.dto";

describe("TaskService/create", () => {
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

  it("should successfully create the task", async () => {
    const createScheduleDto: CreateTaskDTO = {
      accountId: 2024071102,
      scheduleId: "ac6bb267-77b6-466d-812b-0da7552345db",
      startTime: new Date("2024-07-14T23:59:00Z"),
      duration: 1000,
      type: "WORK"
    };

    jest.spyOn(taskService, "validateCreateTask").mockImplementation();

    const mockCreate = jest.spyOn(prismaService.task, "create").mockResolvedValue({} as any);

    const res = await taskService.create(createScheduleDto);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        accountId: 2024071102,
        schedule: {
          connect: { id: "ac6bb267-77b6-466d-812b-0da7552345db" }
        },
        startTime: new Date("2024-07-14T23:59:00Z"),
        duration: 1000,
        type: "WORK"
      }
    });

    expect(res).toEqual({});
  });

  it("should throw error when create failed", async () => {
    const createScheduleDto: CreateTaskDTO = {
      accountId: 2024071102,
      scheduleId: "ac6bb267-77b6-466d-812b-0da7552345db",
      startTime: new Date("2024-07-14T23:59:00Z"),
      duration: 1000,
      type: "WORK"
    };

    jest.spyOn(taskService, "validateCreateTask").mockImplementation();

    const mockCreate = jest.spyOn(prismaService.task, "create").mockRejectedValue(new Error("Failed to create"));

    const errorFn = async () => {
      await taskService.create(createScheduleDto);
    };

    await expect(errorFn).rejects.toThrow("Failed to create");

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        accountId: 2024071102,
        schedule: {
          connect: { id: "ac6bb267-77b6-466d-812b-0da7552345db" }
        },
        startTime: new Date("2024-07-14T23:59:00Z"),
        duration: 1000,
        type: "WORK"
      }
    });
  });
});
