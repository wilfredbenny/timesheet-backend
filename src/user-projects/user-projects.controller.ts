import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { UserProjectsService } from './user-projects.service';

import { AssignUserDto } from './dto/assign-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user-projects')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class UserProjectsController {
  constructor(private userProjectsService: UserProjectsService) {}

  @Post()
  assignUser(
    @Body()
    assignUserDto: AssignUserDto,
    @Req()
    req: any,
  ) {
    return this.userProjectsService
      .assignUser(
        assignUserDto,
        req.user.userId,
      );
  }

  @Get()
  findAll() {
    return this.userProjectsService.findAll();
  }

  @Get('my-projects')

  getMyProjects(

    @Req()
    req: any
  ) {

    return this.userProjectsService
      .getMyProjects(
        req.user.userId
      );
  }
}
