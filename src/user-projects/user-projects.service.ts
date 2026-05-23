import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AssignUserDto } from './dto/assign-user.dto';

@Injectable()
export class UserProjectsService {
  constructor(private prisma: PrismaService) {}

  // assignUser(assignUserDto: AssignUserDto) {
  //   return this.prisma.user_projects.create({
  //     data: {
  //       user_id: BigInt(assignUserDto.user_id),

  //       project_id: BigInt(assignUserDto.project_id),

  //       allocation_percentage: assignUserDto.allocation_percentage,
  //     },
  //   });
  // }

  async assignUser(
    assignUserDto: AssignUserDto,
    currentUserId: string,
  ) {
    const currentUser =
      await this.prisma.users.findUnique({
        where: {
          id: BigInt(currentUserId),
        },
      });
    if (!currentUser) {
      throw new BadRequestException(
        'User not found',
      );
    }
    const employee =
      await this.prisma.users.findUnique({
        where: {
          id: BigInt(assignUserDto.user_id),
        },
      });

    if (!employee) {
      throw new BadRequestException(
        'Employee not found',
      );
    }
    if (currentUser.role !== 'ADMIN') {
      if (
        employee.manager_id?.toString()
        !== currentUserId
      ) {
        throw new BadRequestException(
          'You can assign projects only to your employees',
        );
      }
    }
    return this.prisma.user_projects.create({
      data: {
        user_id:
          BigInt(assignUserDto.user_id),
        project_id:
          BigInt(assignUserDto.project_id),
        allocation_percentage:
          assignUserDto.allocation_percentage,
      },
    });
  }

  findAll() {
    return this.prisma.user_projects.findMany({
      include: {
        users: true,
        projects: true,
      },
    });
  }

  async getMyProjects(
  userId: string
) {

  console.log(
    'USER ID:',
    userId
  );

  const projects =
    await this.prisma.user_projects.findMany({

      where: {
        user_id: BigInt(userId)
      },

      include: {
        projects: true
      }
    });

  console.log(projects);

  return projects;
}
}
