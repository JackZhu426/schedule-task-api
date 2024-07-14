import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsInt, IsOptional, ValidateNested } from "class-validator";
import { TaskType } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateScheduleDTO {
  @IsInt()
  @ApiProperty({ required: true, default: 123 })
  accountId: number;

  @IsInt()
  @ApiProperty({ required: true, default: 456 })
  agentId: number;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ required: true, default: new Date("2026-01-01") })
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ required: true, default: new Date("2026-03-01") })
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
  @ApiProperty({ default: 223 })
  accountId?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ default: 556 })
  agentId?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({ default: new Date("2026-01-02") })
  startTime?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({ default: new Date("2026-03-02") })
  endTime?: Date;
}
