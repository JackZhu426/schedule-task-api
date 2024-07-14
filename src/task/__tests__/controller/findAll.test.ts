import { TestBed } from "@automock/jest";

import { TaskController } from "src/task/task.controller";
import { TaskService } from "src/task/task.service";

describe("TaskController/findAll", () => {
  let taskController: TaskController;
  let taskService: jest.Mocked<TaskService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(TaskController).compile();
    taskController = unit;
    taskService = container.get(TaskService);
  });

  it("should invoke the task service findAll function", async () => {
    const mockFindAll = jest.spyOn(taskService, "findAll").mockResolvedValue([] as any);

    const res = await taskController.findAll(1, 2);

    expect(mockFindAll).toHaveBeenCalledWith(1, 2);

    expect(res).toEqual([]);
  });
});
