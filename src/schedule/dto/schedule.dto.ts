import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { TaskType } from "@prisma/client";

export class CreateScheduleDTO {
  @IsInt()
  accountId: number;

  @IsInt()
  agentId: number;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskInScheduleDTO)
  tasks?: TaskInScheduleDTO[];
}

class TaskInScheduleDTO {
  @IsInt()
  accountId: number;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsInt()
  duration: number;

  @IsEnum(TaskType)
  type: TaskType;
}

export class UpdateScheduleDTO {
  @IsInt()
  @IsOptional()
  accountId?: number;

  @IsInt()
  @IsOptional()
  agentId?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startTime?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endTime?: Date;
}
