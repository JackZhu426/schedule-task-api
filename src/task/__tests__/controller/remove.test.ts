import { TestBed } from "@automock/jest";

import { TaskController } from "src/task/task.controller";
import { TaskService } from "src/task/task.service";

describe("TaskController/remove", () => {
  let taskController: TaskController;
  let taskService: jest.Mocked<TaskService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(TaskController).compile();
    taskController = unit;
    taskService = container.get(TaskService);
  });

  it("should invoke the task service remove function", async () => {
    const mockRemove = jest.spyOn(taskService, "remove").mockResolvedValue({} as any);

    const res = await taskController.remove("123");

    expect(mockRemove).toHaveBeenCalledWith("123");

    expect(res).toEqual({});
  });
});
