import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { PrismaClientExceptionFilter } from "src/prisma-client-exception/prisma-client-exception.filter";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma, Schedule, Task } from "@prisma/client";
import { CreateTaskDTO } from "src/task/dto/task.dto";
import { CreateScheduleDTO, UpdateScheduleDTO } from "src/schedule/dto/schedule.dto";

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
      accountId: 2026071402,
      agentId: 555,
      startTime: "2026-07-15T00:00:00Z",
      endTime: "2026-07-16T00:00:00Z"
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
        schedule = await prisma.schedule.create({
          data: baseSchema
        });
      });

      it("should successfully get one schedule", async () => {
        const { status, body } = await request(app.getHttpServer()).get(`/schedule/${schedule.id}`);

        expect(status).toBe(200);

        expect(body).toEqual(scheduleSchema);
      });
    });

    describe("POST /", () => {
      beforeEach(async () => {
        await prisma.schedule.deleteMany();
      });

      it("should successfully create a schedule", async () => {
        const createScheduleDto: CreateScheduleDTO = {
          accountId: baseSchema.accountId,
          agentId: baseSchema.agentId,
          startTime: new Date(baseSchema.startTime),
          endTime: new Date(baseSchema.endTime)
        };

        const { status, body } = await request(app.getHttpServer()).post("/schedule").send(createScheduleDto);

        expect(status).toBe(201);

        expect(body).toEqual(scheduleSchema);
      });
    });

    describe("UPDATE /:id", () => {
      let schedule: Schedule;
      beforeEach(async () => {
        await prisma.schedule.deleteMany();
        schedule = await prisma.schedule.create({ data: baseSchema });
      });

      it("should successfully update the schedule", async () => {
        const updateScheduleDto: UpdateScheduleDTO = {
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

    describe("DELETE /:id", () => {
      let schedule: Schedule;
      beforeEach(async () => {
        await prisma.schedule.deleteMany();
        schedule = await prisma.schedule.create({ data: baseSchema });
      });

      it("should successfully delete the schedule", async () => {
        const { status } = await request(app.getHttpServer()).delete(`/schedule/${schedule.id}`);

        expect(status).toBe(200);
      });
    });
  });

  describe("/task", () => {
    const taskSchema = expect.objectContaining({
      id: expect.any(String),
      accountId: expect.any(Number),
      scheduleId: expect.any(String),
      startTime: expect.any(String),
      duration: expect.any(Number),
      type: expect.any(String)
    });

    const baseScheduleSchema: Prisma.ScheduleCreateInput = {
      accountId: 2026071402,
      agentId: 555,
      startTime: "2026-07-15T00:00:00Z",
      endTime: "2026-07-16T00:00:00Z"
    };

    const baseTaskSchema: Prisma.TaskCreateManyInput = {
      accountId: 2026071402,
      startTime: "2026-07-15T00:00:00Z",
      duration: 1000,
      type: "WORK",
      scheduleId: ""
    };

    describe("GET /", () => {
      let schedule: Schedule;
      beforeEach(async () => {
        await prisma.task.deleteMany();
        schedule = await prisma.schedule.create({
          data: baseScheduleSchema
        });
        await prisma.task.createMany({
          data: Array.from({ length: 11 })
            .fill(1)
            .map(() => ({ ...baseTaskSchema, scheduleId: schedule.id }))
        });
      });
      it("should return correct tasks", async () => {
        const { status, body } = await request(app.getHttpServer()).get("/task");

        expect(status).toBe(200);

        expect(body.tasks).toEqual(expect.arrayContaining([taskSchema]));

        expect(body.tasks).toHaveLength(10);

        expect(body.metaData).toEqual({
          totalTaskCount: 11,
          totalPages: 2,
          currentPage: 1,
          pageSize: 10
        });
      });

      it("should return correct tasks (page is 2)", async () => {
        const { status, body } = await request(app.getHttpServer()).get("/task?page=2");

        expect(status).toBe(200);

        expect(body.tasks).toEqual(expect.arrayContaining([taskSchema]));

        expect(body.tasks).toHaveLength(1);
      });
    });

    describe("GET /:id", () => {
      let task: Task;
      let schedule: Schedule;
      beforeEach(async () => {
        await prisma.task.deleteMany();
        schedule = await prisma.schedule.create({
          data: baseScheduleSchema
        });
        task = await prisma.task.create({
          data: {
            ...baseTaskSchema,
            scheduleId: schedule.id
          }
        });
      });

      it("should successfully get one task", async () => {
        const { status, body } = await request(app.getHttpServer()).get(`/task/${task.id}`);

        expect(status).toBe(200);

        expect(body).toEqual(taskSchema);
      });
    });

    describe("POST /", () => {
      let schedule: Schedule;
      beforeEach(async () => {
        await prisma.task.deleteMany();
        schedule = await prisma.schedule.create({
          data: baseScheduleSchema
        });
      });

      it("should successfully create a task", async () => {
        const createTaskDto: CreateTaskDTO = {
          accountId: baseTaskSchema.accountId,
          duration: baseTaskSchema.duration,
          startTime: new Date(baseTaskSchema.startTime),
          type: baseTaskSchema.type,
          scheduleId: schedule.id
        };

        const { status, body } = await request(app.getHttpServer()).post("/task").send(createTaskDto);

        expect(status).toBe(201);

        expect(body).toEqual(taskSchema);
      });
    });

    describe("UPDATE /:id", () => {
      let task: Task;
      let schedule: Schedule;
      beforeEach(async () => {
        await prisma.task.deleteMany();
        schedule = await prisma.schedule.create({
          data: baseScheduleSchema
        });
        task = await prisma.task.create({
          data: {
            ...baseTaskSchema,
            scheduleId: schedule.id
          }
        });
      });

      it("should successfully update the task", async () => {
        const updateTaskDto: Prisma.TaskUpdateInput = {
          accountId: 123
        };

        const { status, body } = await request(app.getHttpServer()).patch(`/task/${task.id}`).send(updateTaskDto);

        expect(status).toBe(200);

        expect(body.accountId).toEqual(123);

        expect(body).toEqual(taskSchema);
      });
    });

    describe("DELETE /:id", () => {
      let task: Task;
      let schedule: Schedule;
      beforeEach(async () => {
        await prisma.task.deleteMany();
        schedule = await prisma.schedule.create({
          data: baseScheduleSchema
        });
        task = await prisma.task.create({
          data: {
            ...baseTaskSchema,
            scheduleId: schedule.id
          }
        });
      });

      it("should successfully delete the task", async () => {
        const { status } = await request(app.getHttpServer()).delete(`/task/${task.id}`);

        expect(status).toBe(200);
      });
    });
  });
});
