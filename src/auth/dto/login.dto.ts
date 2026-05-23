import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
      example: 'user@test.com',
      description:
        'Email ID'
    })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '*******',
    description:
      'Password'
  })
  password: string;
}
