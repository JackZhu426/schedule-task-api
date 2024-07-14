import { TestBed } from "@automock/jest";
import { PrismaService } from "src/prisma/prisma.service";
import { ScheduleService } from "src/schedule/schedule.service";
import MockDate from "mockdate";
import { BadRequestException } from "@nestjs/common";
import { TaskService } from "src/task/task.service";
import { CreateTaskDTO, UpdateTaskDTO } from "src/task/dto/task.dto";

describe("TaskService/validateCreateTask", () => {
  let taskService: TaskService;
  let scheduleService: jest.Mocked<ScheduleService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    MockDate.set("2024-01-02T00:00:00Z");
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

  it("should throw error when task NOT found", async () => {
    const createTaskDTO: CreateTaskDTO = {
      accountId: 2024071102,
      scheduleId: "ac6bb267-77b6-466d-812b-0da7552345db",
      startTime: new Date("2024-01-01T00:00:00Z"),
      duration: 1000,
      type: "WORK"
    };

    jest.spyOn(scheduleService, "findOne").mockResolvedValue({} as any);

    const errorFn = async () => {
      await taskService.validateCreateTask(createTaskDTO);
    };

    expect(errorFn).rejects.toThrow(BadRequestException);
    expect(errorFn).rejects.toThrow("Start time cannot be in the past");
  });

  it("should throw error when schedule NOT found", async () => {
    const createScheduleDto: CreateTaskDTO = {
      accountId: 2024071102,
      scheduleId: "ac6bb267-77b6-466d-812b-0da7552345db",
      startTime: new Date("2024-01-03T00:00:00Z"),
      duration: 1000,
      type: "WORK"
    };

    jest.spyOn(scheduleService, "findOne").mockResolvedValue(null);

    const errorFn = async () => {
      await taskService.validateCreateTask(createScheduleDto);
    };

    expect(errorFn).rejects.toThrow(BadRequestException);
    expect(errorFn).rejects.toThrow("Schedule with ID - ac6bb267-77b6-466d-812b-0da7552345db not found");
  });

  it("should throw error when 'task' end time is after 'schedule' end time", async () => {
    const createScheduleDto: CreateTaskDTO = {
      accountId: 2024071102,
      scheduleId: "ac6bb267-77b6-466d-812b-0da7552345db",
      startTime: new Date("2024-01-03T00:00:00Z"),
      duration: 1000,
      type: "WORK"
    };

    jest.spyOn(scheduleService, "findOne").mockResolvedValue({ endTime: new Date("2024-01-03T00:00:00Z") } as any);

    const errorFn = async () => {
      await taskService.validateCreateTask(createScheduleDto);
    };

    expect(errorFn).rejects.toThrow(BadRequestException);
    expect(errorFn).rejects.toThrow("'Task' end time cannot be after 'Schedule' end time");
  });
});
