import { Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { ProjectsService } from './projects.service';

import { CreateProjectDto } from './dto/create-project.dto';

import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('projects')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Post()
  @UseGuards(new RolesGuard(['ADMIN']))
  create(
    @Body()
    createProjectDto: CreateProjectDto,

    @Req()
    req: any,
  ) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
          throw new ForbiddenException(
            'Only ADMIN/MANAGER can create projects'
          );
        }
    return this.projectsService.create(createProjectDto, req.user.userId);
  }
}
