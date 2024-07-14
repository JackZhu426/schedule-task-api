import { TestBed } from "@automock/jest";

import { TaskController } from "src/task/task.controller";
import { TaskService } from "src/task/task.service";

describe("TaskController/findOne", () => {
  let taskController: TaskController;
  let taskService: jest.Mocked<TaskService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(TaskController).compile();
    taskController = unit;
    taskService = container.get(TaskService);
  });

  it("should invoke the task service findOne function", async () => {
    const mockFindOne = jest.spyOn(taskService, "findOne").mockResolvedValue({} as any);

    const res = await taskController.findOne("123");

    expect(mockFindOne).toHaveBeenCalledWith("123");

    expect(res).toEqual({});
  });
});
