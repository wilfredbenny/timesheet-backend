import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApprovalActionDto {
  @IsNotEmpty()
  @ApiProperty({
      example: 'APPROVED',
      description:
        'Task Approved/Rejected'
    })
  @IsString()
  action: string;

  @IsOptional()
  @ApiProperty({
    example: 'perfect project',
    description:
      'Description/Comments'
  })
  @IsString()
  comments?: string;
}
