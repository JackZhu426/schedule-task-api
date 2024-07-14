import { TestBed } from "@automock/jest";

import { ScheduleService } from "src/schedule/schedule.service";
import { CreateScheduleDTO } from "src/schedule/dto/schedule.dto";
import { ScheduleController } from "src/schedule/schedule.controller";

describe("ScheduleController/create", () => {
  let scheduleController: ScheduleController;
  let scheduleService: jest.Mocked<ScheduleService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleController).compile();
    scheduleController = unit;
    scheduleService = container.get(ScheduleService);
  });

  it("should invoke the schedule service create function", async () => {
    const createScheduleDto: CreateScheduleDTO = {
      accountId: 123,
      agentId: 456,
      startTime: new Date("2024-01-01T00:00:00Z"),
      endTime: new Date("2024-01-01T01:00:00Z")
    };

    const mockCreate = jest.spyOn(scheduleService, "create").mockResolvedValue({} as any);

    const res = await scheduleController.create(createScheduleDto);

    expect(mockCreate).toHaveBeenCalledWith({
      accountId: 123,
      agentId: 456,
      startTime: new Date("2024-01-01T00:00:00Z"),
      endTime: new Date("2024-01-01T01:00:00Z")
    });

    expect(res).toEqual({});
  });
});
