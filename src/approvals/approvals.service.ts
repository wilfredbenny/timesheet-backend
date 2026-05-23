import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApprovalActionDto } from './dto/approval-action.dto';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  async getApprovals(
    managerId: string,

    paginationDto: PaginationDto,
  ) {
    const page = Number(paginationDto.page || 1);

    const limit = Number(paginationDto.limit || 10);

    const skip = (page - 1) * limit;

    const where: any = {
      users: {
        manager_id: BigInt(managerId),
      },
    };

    if (paginationDto.status) {
      where.status = paginationDto.status;
    }

    if (paginationDto.search) {
      where.users = {
        manager_id: BigInt(managerId),

        OR: [
          {
            first_name: {
              contains: paginationDto.search,

              mode: 'insensitive',
            },
          },

          {
            email: {
              contains: paginationDto.search,

              mode: 'insensitive',
            },
          },
        ],
      };
    }

    const data = await this.prisma.timesheets.findMany({
      where,

      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            email: true,
          },
        },

        projects: {
          select: {
            id: true,
            project_name: true,
          },
        },
      },

      skip,
      take: limit,

      orderBy: {
        submitted_at: 'desc',
      },
    });

    const total = await this.prisma.timesheets.count({
      where,
    });

    return {
      data,

      meta: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async actionTimesheet(
    timesheetId: string,

    approvalActionDto: ApprovalActionDto,

    managerId: string,
  ) {
    const timesheet = await this.prisma.timesheets.findUnique({
      where: {
        id: BigInt(timesheetId),
      },
    });

    if (!timesheet) {
      throw new BadRequestException('Timesheet not found');
    }

    const currentUser = await this.prisma.users.findUnique({
      where: {
        id: BigInt(managerId),
      },
    });

    if (!currentUser) {
      throw new BadRequestException('User not found');
    }

    if (currentUser.role !== 'ADMIN') {

      const employee = await this.prisma.users.findUnique({
        where: {
          id: timesheet.user_id,
        },
      });

      if (employee?.manager_id?.toString() !== managerId) {
        throw new BadRequestException(
          'You are not manager of this employee',
        );
      }
    }

    if (timesheet.status !== 'SUBMITTED') {
      throw new BadRequestException(
        'Only submitted timesheets can be processed',
      );
    }

    if (!['APPROVED', 'REJECTED'].includes(approvalActionDto.action)) {
      throw new BadRequestException('Invalid action');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedTimesheet = await tx.timesheets.update({
        where: {
          id: BigInt(timesheetId),
        },

        data: {
          status: approvalActionDto.action,

          updated_at: new Date(),
        },
      });

      await tx.approvals.create({
        data: {
          timesheet_id: BigInt(timesheetId),

          manager_id: BigInt(managerId),

          status: approvalActionDto.action,

          comments: approvalActionDto.comments,

          action_at: new Date(),
        },
      });

      return updatedTimesheet;
    });
  }

  async getPendingApprovals(
    managerId: string,
  ) {

    const currentUser =
      await this.prisma.users.findUnique({

        where: {
          id: BigInt(managerId),
        },
      });

    if (currentUser?.role === 'ADMIN') {

      return this.prisma.timesheets.findMany({

        where: {
          status: 'SUBMITTED',
        },

        include: {

          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },

          projects: {
            select: {
              id: true,
              project_name: true,
              project_code: true,
            },
          },
        },

        orderBy: {
          submitted_at: 'desc',
        },
      });
    }

    return this.prisma.timesheets.findMany({

      where: {

        status: 'SUBMITTED',

        users: {
          manager_id: BigInt(managerId),
        },
      },

      include: {

        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },

        projects: {
          select: {
            id: true,
            project_name: true,
            project_code: true,
          },
        },
      },

      orderBy: {
        submitted_at: 'desc',
      },
    });
  }

  async getManagerDashboard(managerId: string) {
    const currentUser =
      await this.prisma.users.findUnique({

        where: {
          id: BigInt(managerId),
        },
      });

    const userFilter =
      currentUser?.role === 'ADMIN'
        ? {}
        : {
            users: {
              manager_id: BigInt(managerId),
            },
          };
    const pendingCount = await this.prisma.timesheets.count({
      where: {
        status: 'SUBMITTED',
        ...userFilter,
      },
    });

    const approvedCount = await this.prisma.timesheets.count({
      where: {
        status: 'APPROVED',
        ...userFilter,
      },
    });

    const rejectedCount = await this.prisma.timesheets.count({
      where: {
        status: 'REJECTED',
        ...userFilter,
      },
    });

    const totalHours = await this.prisma.timesheets.aggregate({
      _sum: {
        hours_worked: true,
      },

      where: {
        ...userFilter,
      },
    });

    return {
      pendingCount,

      approvedCount,

      rejectedCount,

      totalHours: totalHours._sum.hours_worked || 0,
    };
  }

  async getMonthlyEmployeeReport(managerId: string) {
    const currentUser =
      await this.prisma.users.findUnique({

        where: {
          id: BigInt(managerId),
        },
      });

    const userFilter =
      currentUser?.role === 'ADMIN'
        ? {}
        : {
            users: {
              manager_id: BigInt(managerId),
            },
      };

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    );

    const report = await this.prisma.timesheets.groupBy({
      by: ['user_id'],

      where: {
        ...userFilter,
        status: 'APPROVED',
        work_date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },

      _sum: {
        hours_worked: true,
      },

      _count: {
        id: true,
      },
    });

    const enrichedReport = await Promise.all(
      report.map(async (item) => {
        const user = await this.prisma.users.findUnique({
          where: {
            id: item.user_id,
          },

          select: {
            id: true,
            first_name: true,
            email: true,
          },
        });

        return {
          employee: user,

          totalHours: item._sum.hours_worked,

          totalEntries: item._count.id,
        };
      }),
    );

    return enrichedReport;
  }
}
