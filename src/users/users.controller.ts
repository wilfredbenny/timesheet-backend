import { Controller, ForbiddenException, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Body, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Req()
    req: any,
  ) {
    return this.usersService.findAll(
      req.user.userId,
    );
  }

  @Post()
  create(
    @Req() req: any,
    @Body() createUserDto: CreateUserDto
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only ADMIN can create users'
      );
    }
    return this.usersService.create(createUserDto);
  }
}
