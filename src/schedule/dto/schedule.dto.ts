import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { TaskType } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateScheduleDTO {
  @IsInt()
  @ApiProperty({ required: true, default: 123 })
  accountId: number;

  @IsInt()
  @ApiProperty()
  agentId: number;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new Date("2025-01-01") })
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: new Date() })
  endTime: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskInScheduleDTO)
  @ApiProperty({ default: [] })
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
