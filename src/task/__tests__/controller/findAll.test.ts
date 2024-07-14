import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { ScheduleController } from "src/schedule/schedule.controller";

describe("ScheduleController/findAll", () => {
  let scheduleController: ScheduleController;
  let scheduleService: jest.Mocked<ScheduleService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleController).compile();
    scheduleController = unit;
    scheduleService = container.get(ScheduleService);
  });

  it("should invoke the schedule service findAll function", async () => {
    jest.spyOn(scheduleService, "validateCreateSchedule").mockImplementation();

    const mockFindAll = jest.spyOn(scheduleService, "findAll").mockResolvedValue([] as any);

    const res = await scheduleController.findAll(1, 2);

    expect(mockFindAll).toHaveBeenCalledWith(1, 2);

    expect(res).toEqual([]);
  });
});
