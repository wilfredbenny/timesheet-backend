import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty }
from '@nestjs/swagger';

export class CreateTimesheetDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 1
  })
  project_id: number;

  @IsDateString()
  @ApiProperty({
    example: '2026-05-18'
  })
  work_date: string;

  @IsNumber()
  @ApiProperty({
    example: 8
  })
  hours_worked: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
  example:
    'Worked on auth APIs'
  })
  task_description?: string;
}
