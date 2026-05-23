import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class AssignUserDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description:
      'User ID'
  })
  user_id: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description:
      'Project ID'
  })
  project_id: number;

  @IsOptional()
  @ApiProperty({
    example: 10,
    description:
      'Allocation Percentage'
  })
  allocation_percentage?: number;
}
