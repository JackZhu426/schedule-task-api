import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsUUID } from "class-validator";
import { TaskType } from "@prisma/client";

export class CreateTaskDTO {
  @IsInt()
  @IsNotEmpty()
  accountId: number;

  @IsUUID()
  @IsNotEmpty()
  scheduleId: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startTime: Date;

  @IsInt()
  @IsNotEmpty()
  duration: number;

  @IsEnum(TaskType)
  @IsNotEmpty()
  type: TaskType;
}
