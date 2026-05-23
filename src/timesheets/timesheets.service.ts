import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTimesheetDto } from './dto/create-timesheet.dto';

@Injectable()
export class TimesheetsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTimesheetDto: CreateTimesheetDto,

    userId: string,
  ) {
    const assignment = await this.prisma.user_projects.findFirst({
      where: {
        user_id: BigInt(userId),

        project_id: BigInt(createTimesheetDto.project_id),
      },
    });

    if (!assignment) {
      throw new BadRequestException('User not assigned to project');
    }

    return this.prisma.timesheets.create({
      data: {
        user_id: BigInt(userId),

        project_id: BigInt(createTimesheetDto.project_id),

        work_date: new Date(createTimesheetDto.work_date),

        hours_worked: createTimesheetDto.hours_worked,

        task_description: createTimesheetDto.task_description,

        status: 'DRAFT',
      },
    });
  }

  findMyTimesheets(userId: string) {
    return this.prisma.timesheets.findMany({
      where: {
        user_id: BigInt(userId),
      },

      include: {
        projects: true,
      },

      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async submitTimesheet(timesheetId: string, userId: string) {
    const timesheet = await this.prisma.timesheets.findFirst({
      where: {
        id: BigInt(timesheetId),
        user_id: BigInt(userId),
      },
    });

    if (!timesheet) {
      throw new BadRequestException('Timesheet not found');
    }

    if (timesheet.status !== 'DRAFT') {
      throw new BadRequestException('Only draft timesheets can be submitted');
    }

    return this.prisma.timesheets.update({
      where: {
        id: BigInt(timesheetId),
      },

      data: {
        status: 'SUBMITTED',
        submitted_at: new Date(),
      },
    });
  }
}
