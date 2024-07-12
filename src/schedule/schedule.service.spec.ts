// import { TestBed } from "@automock/jest";

// import { ScheduleService } from "./schedule.service";
// import { ConfigService } from "@nestjs/config";
// import { PrismaService } from "../../src/prisma/prisma.service";
// import { isUUID } from "class-validator";

// jest.mock("class-validator");

// describe("ScheduleService", () => {
//   let service: ScheduleService;
//   let prismaService: jest.Mocked<PrismaService>;
//   let configService: jest.Mocked<ConfigService>;

//   beforeEach(async () => {
//     const { unit, unitRef } = TestBed.create(ScheduleService).mock(PrismaService, () => {}).compile();
//     service = unit;
//     prismaService = unitRef.get(PrismaService);
//     configService = unitRef.get(ConfigService);
//   });

//   it("should return one schedule", async () => {
//     const mockIsUUID = isUUID as jest.Mock;
//     mockIsUUID.mockReturnValue(true);

//     jest.spyOn(prismaService.schedule, "findUnique").mockResolvedValue({} as unknown as any);

//     const res = await service.findOne("ac6bb267-77b6-466d-812b-0da7552345db");

//     expect(res).toEqual({});
//   });
// });
import { Test, TestingModule } from "@nestjs/testing";
import { ScheduleService } from "./schedule.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { isUUID } from "class-validator";
jest.mock("class-validator");

describe("ScheduleService", () => {
  let service: ScheduleService;

  const mockedPrismaService = {
    schedule: {
      findUnique: jest.fn()
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        { provide: PrismaService, useValue: mockedPrismaService },
        { provide: ConfigService, useValue: {} }
      ]
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it("should be defined", async () => {
    const mocked = isUUID as jest.Mock;
    mocked.mockReturnValue(true);
    const test = { id: "1234" };
    mockedPrismaService.schedule.findUnique.mockResolvedValue(test);

    const res = await service.findOne("1234");

    expect(res).toEqual(test);
  });
});
