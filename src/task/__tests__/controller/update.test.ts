import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";

import { ScheduleController } from "src/schedule/schedule.controller";
import { UpdateScheduleDTO } from "src/schedule/dto/schedule.dto";

describe("ScheduleController/update", () => {
  let scheduleController: ScheduleController;
  let scheduleService: jest.Mocked<ScheduleService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleController).compile();
    scheduleController = unit;
    scheduleService = container.get(ScheduleService);
  });

  it("should invoke the schedule service update function", async () => {
    const updateScheduleDto: UpdateScheduleDTO = {};

    jest.spyOn(scheduleService, "validateCreateSchedule").mockImplementation();

    const mockUpdate = jest.spyOn(scheduleService, "update").mockResolvedValue({} as any);

    const res = await scheduleController.update("123", updateScheduleDto);

    expect(mockUpdate).toHaveBeenCalledWith("123", {});

    expect(res).toEqual({});
  });
});
