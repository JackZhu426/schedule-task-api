import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsUUID } from "class-validator";
import { TaskType } from "@prisma/client";

export class CreateTaskDTO {
  @IsInt()
  accountId: number;

  @IsUUID()
  scheduleId: string;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsInt()
  @IsPositive()
  duration: number; // assume it is 'seconds'

  @IsEnum(TaskType)
  type: TaskType;
}

export class UpdateTaskDTO {
  @IsInt()
  @IsOptional()
  accountId?: number;

  @IsUUID()
  @IsOptional()
  scheduleId?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startTime?: Date;

  @IsInt()
  @IsOptional()
  @IsPositive()
  duration?: number;

  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;
}
