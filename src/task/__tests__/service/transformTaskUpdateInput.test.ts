import { TestBed } from "@automock/jest";
import { PrismaService } from "src/prisma/prisma.service";
import { ScheduleService } from "src/schedule/schedule.service";
import { TaskService } from "src/task/task.service";

describe("TaskService/transformTaskUpdateInput", () => {
  let taskService: TaskService;
  let scheduleService: jest.Mocked<ScheduleService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(TaskService).compile();
    taskService = unit;
    prismaService = container.get(PrismaService);
    scheduleService = container.get(ScheduleService);
  });

  it("should return the corresponding update input (fields exist)", () => {
    const updateInput = taskService.transformTaskUpdateInput({
      accountId: 123,
      startTime: new Date("2024-01-01T00:00:00Z"),
      duration: 1000,
      type: "WORK",
      scheduleId: "ac6bb267-77b6-466d-812b-0da7552345db"
    });

    expect(updateInput).toEqual({
      accountId: 123,
      startTime: new Date("2024-01-01T00:00:00Z"),
      duration: 1000,
      type: "WORK",
      schedule: {
        connect: { id: "ac6bb267-77b6-466d-812b-0da7552345db" }
      }
    });
  });

  it("should return the corresponding update input (fields NOT exist)", () => {
    const updateInput = taskService.transformTaskUpdateInput({});

    expect(updateInput).toEqual({});
  });
});
