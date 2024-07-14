import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { ScheduleController } from "src/schedule/schedule.controller";

describe("ScheduleController/remove", () => {
  let scheduleController: ScheduleController;
  let scheduleService: jest.Mocked<ScheduleService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleController).compile();
    scheduleController = unit;
    scheduleService = container.get(ScheduleService);
  });

  it("should invoke the schedule service remove function", async () => {
    const mockRemove = jest.spyOn(scheduleService, "remove").mockResolvedValue({} as any);

    const res = await scheduleController.remove("123");

    expect(mockRemove).toHaveBeenCalledWith("123");

    expect(res).toEqual({});
  });
});
