import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsUUID } from "class-validator";
import { TaskType } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDTO {
  @IsInt()
  @ApiProperty({ required: true, default: 321 })
  accountId: number;

  @IsUUID()
  @ApiProperty({ required: true })
  scheduleId: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({ required: true, default: new Date("2026-01-02") })
  startTime: Date;

  @IsInt()
  @IsPositive()
  @ApiProperty({ required: true, default: 1000 })
  duration: number; // assume it is 'seconds'

  @IsEnum(TaskType)
  @ApiProperty({ required: true, default: "WORK", description: "WORK | BREAK" })
  type: TaskType;
}

export class UpdateTaskDTO {
  @IsInt()
  @IsOptional()
  @ApiProperty({ default: 322 })
  accountId?: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty()
  scheduleId?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({ default: new Date("2026-01-03") })
  startTime?: Date;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @ApiProperty({ default: 2000 })
  duration?: number; // assume it is 'seconds'

  @IsEnum(TaskType)
  @IsOptional()
  @ApiProperty({ default: "BREAK", description: "WORK | BREAK" })
  type?: TaskType;
}
