import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";

import { ScheduleController } from "src/schedule/schedule.controller";
import { UpdateScheduleDTO } from "src/schedule/dto/schedule.dto";
import { TaskController } from "src/task/task.controller";
import { TaskService } from "src/task/task.service";

describe("TaskController/update", () => {
  let taskController: TaskController;
  let taskService: jest.Mocked<TaskService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(TaskController).compile();
    taskController = unit;
    taskService = container.get(TaskService);
  });

  it("should invoke the task service update function", async () => {
    const updateScheduleDto: UpdateScheduleDTO = {};

    const mockUpdate = jest.spyOn(taskService, "update").mockResolvedValue({} as any);

    const res = await taskController.update("123", updateScheduleDto);

    expect(mockUpdate).toHaveBeenCalledWith("123", {});

    expect(res).toEqual({});
  });
});
