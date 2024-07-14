import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { ScheduleController } from "src/schedule/schedule.controller";

describe("ScheduleController/findOne", () => {
  let scheduleController: ScheduleController;
  let scheduleService: jest.Mocked<ScheduleService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleController).compile();
    scheduleController = unit;
    scheduleService = container.get(ScheduleService);
  });

  it("should invoke the schedule service findOne function", async () => {
    const mockFindOne = jest.spyOn(scheduleService, "findOne").mockResolvedValue({} as any);

    const res = await scheduleController.findOne("123");

    expect(mockFindOne).toHaveBeenCalledWith("123");

    expect(res).toEqual({});
  });
});
