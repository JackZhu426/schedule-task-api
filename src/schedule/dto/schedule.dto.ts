import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Prisma, TaskType } from "@prisma/client";

export class CreateScheduleDTO {
  @IsInt()
  @IsNotEmpty()
  accountId: number;

  @IsInt()
  @IsNotEmpty()
  agentId: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endTime: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Transform((value) => value || [])
  @Type(() => TaskInScheduleDTO)
  tasks?: TaskInScheduleDTO[];
}

class TaskInScheduleDTO {
  @IsInt()
  @IsNotEmpty()
  accountId: number;

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
