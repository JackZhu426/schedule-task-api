import { TestBed } from "@automock/jest";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateScheduleDTO } from "src/schedule/dto/schedule.dto";
import { ScheduleService } from "src/schedule/schedule.service";
import MockDate from "mockdate";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { TaskService } from "src/task/task.service";
import { UpdateTaskDTO } from "src/task/dto/task.dto";

describe("TaskService/validateUpdateTask", () => {
  let taskService: TaskService;
  let scheduleService: jest.Mocked<ScheduleService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    MockDate.set("2024-01-02T00:00:00Z");
    const { unit, unitRef: container } = TestBed.create(TaskService)
      .mock(ScheduleService)
      .using({
        findOne: jest.fn()
      })
      .compile();
    taskService = unit;
    prismaService = container.get(PrismaService);
    scheduleService = container.get(ScheduleService);
  });

  it("should throw error when task NOT found", async () => {
    const updateTaskDto: UpdateTaskDTO = {
      accountId: 123
    };

    const mockFindOne = jest.spyOn(taskService, "findOne").mockResolvedValue(null);

    const errorFn = async () => {
      await taskService.validateUpdateTask("123", updateTaskDto);
    };

    expect(errorFn).rejects.toThrow(NotFoundException);
    expect(errorFn).rejects.toThrow("Task with ID - 123 not found");

    expect(mockFindOne).toHaveBeenCalledWith("123");
  });

  it("should throw error when start time is in the past", async () => {
    const updateTaskDto: UpdateTaskDTO = {
      startTime: new Date("2024-01-01T00:00:00Z")
    };

    const mockFindOne = jest.spyOn(taskService, "findOne").mockResolvedValue({} as any);

    const errorFn = async () => {
      await taskService.validateUpdateTask("123", updateTaskDto);
    };

    expect(errorFn).rejects.toThrow(BadRequestException);
    expect(errorFn).rejects.toThrow("Start time cannot be in the past");

    expect(mockFindOne).toHaveBeenCalledWith("123");
  });

  it("should throw error when schedule NOT found", async () => {
    const updateTaskDto: UpdateTaskDTO = {
      scheduleId: "123",
      duration: 100,
      startTime: new Date("2024-01-04T00:00:00Z")
    };

    const mockTaskFindOne = jest.spyOn(taskService, "findOne").mockResolvedValue({} as any);

    jest.spyOn(scheduleService, "findOne").mockResolvedValue(null);

    const errorFn = async () => {
      await taskService.validateUpdateTask("123", updateTaskDto);
    };

    expect(errorFn).rejects.toThrow(BadRequestException);
    expect(errorFn).rejects.toThrow("Schedule with ID - 123 not found");

    expect(mockTaskFindOne).toHaveBeenCalledWith("123");
  });

  it("should throw error when 'task' end time is after 'schedule' end time", async () => {
    const updateTaskDto: UpdateTaskDTO = {
      scheduleId: "123",
      duration: 1000,
      startTime: new Date("2024-01-04T00:00:00Z")
    };

    const mockTaskFindOne = jest.spyOn(taskService, "findOne").mockResolvedValue({} as any);

    jest.spyOn(scheduleService, "findOne").mockResolvedValue({
      endTime: new Date("2024-01-03T00:00:00Z")
    } as any);

    const errorFn = async () => {
      await taskService.validateUpdateTask("123", updateTaskDto);
    };

    expect(errorFn).rejects.toThrow(BadRequestException);
    expect(errorFn).rejects.toThrow("'Task' end time cannot be after 'Schedule' end time");

    expect(mockTaskFindOne).toHaveBeenCalledWith("123");
  });

  it("should NOT throw error if 'startTime' and 'duration' and 'scheduleId' not passed in", async () => {
    const updateTaskDto: UpdateTaskDTO = {};

    const mockFindOne = jest.spyOn(taskService, "findOne").mockResolvedValue({
      startTime: new Date("2024-01-02T10:00:00Z"),
      endTime: new Date("2024-01-03T00:00:00Z"),
      scheduleId: "456"
    } as any);
    const mockScheduleFindOne = jest.spyOn(scheduleService, "findOne").mockResolvedValue({} as any);

    await taskService.validateUpdateTask("123", updateTaskDto);

    expect(mockFindOne).toHaveBeenCalledWith("123");
    expect(mockScheduleFindOne).toHaveBeenCalledWith("456");
  });
});
