import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsUUID } from "class-validator";
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
  @IsPositive()
  duration: number;

  @IsEnum(TaskType)
  @IsNotEmpty()
  type: TaskType;
}

export class UpdateTaskDTO {
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  accountId?: number;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  scheduleId?: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @IsOptional()
  startTime?: Date;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  duration?: number;

  @IsEnum(TaskType)
  @IsNotEmpty()
  @IsOptional()
  type?: TaskType;
}
