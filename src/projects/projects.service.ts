import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto, userId: string) {
    return this.prisma.projects.create({
      data: {
        ...createProjectDto,
        created_by: BigInt(userId),
      },
    });
  }

  findAll() {
    return this.prisma.projects.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
