import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
      example: '0A1A',
      description:
        'Employee Code'
    })
  @IsString()
  employee_code: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Wilfred',
    description:
      'First Name'
  })
  @IsString()
  first_name: string;

  @IsOptional()
  @ApiProperty({
    example: 'Benny',
    description:
      'Last Name'
  })
  @IsString()
  last_name?: string;

  @IsEmail()
  @ApiProperty({
    example: 'wilfred@testmail.com',
    description:
      'Email ID'
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '',
    description:
      'Password'
  })
  password: string;

  @IsOptional()
  @ApiProperty({
    example: 'EMPLOYEE',
    description:
      'Role Name'
  })
  role?: string;

  @IsOptional()
  @ApiProperty({
    example: 1,
    description:
      'Manager ID'
  })
  @IsNumber()
  reporting_manager_id?: number;
}
