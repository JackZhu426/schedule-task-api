import { TestBed } from "@automock/jest";

import { CreateTaskDTO } from "src/task/dto/task.dto";
import { TaskController } from "src/task/task.controller";
import { TaskService } from "src/task/task.service";

describe("TaskController/create", () => {
  let taskController: TaskController;
  let taskService: jest.Mocked<TaskService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(TaskController).compile();
    taskController = unit;
    taskService = container.get(TaskService);
  });

  it("should invoke the task service create function", async () => {
    const createScheduleDto: CreateTaskDTO = {
      accountId: 123,
      scheduleId: "123",
      duration: 1000,
      type: "WORK",
      startTime: new Date("2024-01-01T00:00:00Z")
    };

    const mockCreate = jest.spyOn(taskService, "create").mockResolvedValue({} as any);

    const res = await taskController.create(createScheduleDto);

    expect(mockCreate).toHaveBeenCalledWith({
      accountId: 123,
      scheduleId: "123",
      duration: 1000,
      type: "WORK",
      startTime: new Date("2024-01-01T00:00:00Z")
    });

    expect(res).toEqual({});
  });
});
