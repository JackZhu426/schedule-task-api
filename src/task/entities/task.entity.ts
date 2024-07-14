import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Task } from "@prisma/client";

export class TaskEntity implements Task {
  @ApiProperty()
  id: string;
  @ApiProperty()
  accountId: number;
  @ApiProperty()
  scheduleId: string;
  @ApiProperty()
  startTime: Date;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  type: $Enums.TaskType;
}
