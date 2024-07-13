import { TestBed } from "@automock/jest";
import { PrismaService } from "src/prisma/prisma.service";
import { ScheduleService } from "src/schedule/schedule.service";

describe("ScheduleService/transformScheduleUpdateInput", () => {
  let scheduleService: ScheduleService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    const { unit, unitRef: container } = TestBed.create(ScheduleService).compile();
    scheduleService = unit;
    prismaService = container.get(PrismaService);
  });

  it("should return the corresponding update input (fields exist)", () => {
    const updateInput = scheduleService.transformScheduleUpdateInput({
      accountId: 123,
      agentId: 456,
      startTime: new Date("2024-01-01T00:00:00Z"),
      endTime: new Date("2024-01-01T01:00:00Z")
    });

    expect(updateInput).toEqual({
      accountId: 123,
      agentId: 456,
      startTime: new Date("2024-01-01T00:00:00Z"),
      endTime: new Date("2024-01-01T01:00:00Z")
    });
  });

  it("should return the corresponding update input (fields NOT exist)", () => {
    const updateInput = scheduleService.transformScheduleUpdateInput({});

    expect(updateInput).toEqual({});
  });
});
