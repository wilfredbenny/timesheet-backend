import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @ApiProperty({
      example: '12',
      description:
        'Project Code'
    })
  @IsString()
  project_code: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Test Project',
    description:
      'Project Name'
  })
  @IsString()
  project_name: string;

  @IsOptional()
  @ApiProperty({
    example: 'Test Client',
    description:
      'Client Name'
  })
  @IsString()
  client_name?: string;

  @IsOptional()
  @ApiProperty({
    example: 'ACTIVE',
    description:
      'Project Status'
  })
  @IsString()
  status?: string;
}
