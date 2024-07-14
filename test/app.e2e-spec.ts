import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { PrismaClientExceptionFilter } from "src/prisma-client-exception/prisma-client-exception.filter";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, Schedule } from "@prisma/client";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new PrismaClientExceptionFilter());
    await app.init();
  });

  describe("/schedule", () => {
    const scheduleSchema = expect.objectContaining({
      id: expect.any(String),
      accountId: expect.any(Number),
      agentId: expect.any(Number),
      startTime: expect.any(String),
      endTime: expect.any(String)
    });
    const baseSchema: Prisma.ScheduleCreateInput = {
      accountId: 2024071402,
      agentId: 555,
      startTime: "2024-07-15T00:00:00Z",
      endTime: "2024-07-16T00:00:00Z"
    };

    describe("GET /", () => {
      beforeEach(async () => {
        await prisma.schedule.deleteMany();
        await prisma.schedule.createMany({
          data: Array.from({ length: 11 })
            .fill(1)
            .map(() => baseSchema)
        });
      });
      it("should return correct schedules", async () => {
        const { status, body } = await request(app.getHttpServer()).get("/schedule");

        expect(status).toBe(200);

        expect(body.schedules).toEqual(expect.arrayContaining([scheduleSchema]));

        expect(body.schedules).toHaveLength(10);

        expect(body.metaData).toEqual({
          totalScheduleCount: 11,
          totalPages: 2,
          currentPage: 1,
          pageSize: 10
        });
      });

      it("should return correct schedules (page is 2)", async () => {
        const { status, body } = await request(app.getHttpServer()).get("/schedule?page=2");

        expect(status).toBe(200);

        expect(body.schedules).toEqual(expect.arrayContaining([scheduleSchema]));

        expect(body.schedules).toHaveLength(1);
      });
    });

    describe("GET /:id", () => {
      let schedule: Schedule;
      beforeEach(async () => {
        await prisma.schedule.deleteMany();
        await prisma.schedule.create({
          data: baseSchema
        });
      });
    });

    describe("UPDATE /:id", () => {
      let schedule: Schedule;
      beforeEach(async () => {
        await prisma.schedule.deleteMany();
        schedule = await prisma.schedule.create({ data: baseSchema });
      });

      it("should successfully update the schedule", async () => {
        const updateScheduleDto: Prisma.ScheduleUpdateInput = {
          accountId: 123
        };

        const { status, body } = await request(app.getHttpServer())
          .patch(`/schedule/${schedule.id}`)
          .send(updateScheduleDto);

        expect(status).toBe(200);

        expect(body.accountId).toEqual(123);

        expect(body).toEqual(scheduleSchema);
      });
    });
  });
});
