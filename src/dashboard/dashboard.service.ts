import { Injectable }
from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()

export class DashboardService {

  constructor(
    private prisma: PrismaService
  ) {}

  async getStats(user: any) {

    const userId =
      BigInt(user.userId);

    const role =
      user.role;

    if (role === 'ADMIN') {

      return this.getAdminStats();
    }

    if (role === 'MANAGER') {

      return this.getManagerStats(
        userId
      );
    }

    return this.getEmployeeStats(
      userId
    );
  }

  async getAdminStats() {

    const [

      totalProjects,

      totalUsers,

      pendingApprovals,

      approvedTimesheets

    ] = await Promise.all([

      this.prisma.projects.count(),

      this.prisma.users.count(),

      this.prisma.timesheets.count({

        where: {
          status: 'SUBMITTED'
        }
      }),

      this.prisma.timesheets.count({

        where: {
          status: 'APPROVED'
        }
      })
    ]);

    return {

      role: 'ADMIN',

      totalProjects,

      totalUsers,

      pendingApprovals,

      approvedTimesheets
    };
  }

  async getManagerStats(
    managerId: bigint
  ) {

    const teamUsers =
      await this.prisma.users.findMany({

        where: {
          manager_id: managerId
        },

        select: {
          id: true
        }
      });

    const userIds =
      teamUsers.map(
        user => user.id
      );

    const [

      pendingApprovals,

      approvedTimesheets

    ] = await Promise.all([

      this.prisma.timesheets.count({

        where: {

          user_id: {
            in: userIds
          },

          status: 'SUBMITTED'
        }
      }),

      this.prisma.timesheets.count({

        where: {

          user_id: {
            in: userIds
          },

          status: 'APPROVED'
        }
      })
    ]);

    return {

      role: 'MANAGER',

      totalTeamMembers:
        userIds.length,

      pendingApprovals,

      approvedTimesheets
    };
  }

  async getEmployeeStats(
    userId: bigint
  ) {

    const [

      myProjects,

      pendingApprovals,

      approvedTimesheets

    ] = await Promise.all([

      this.prisma.user_projects.count({

        where: {
          user_id: userId
        }
      }),

      this.prisma.timesheets.count({

        where: {

          user_id: userId,

          status: 'SUBMITTED'
        }
      }),

      this.prisma.timesheets.count({

        where: {

          user_id: userId,

          status: 'APPROVED'
        }
      })
    ]);

    return {

      role: 'EMPLOYEE',

      myProjects,

      pendingApprovals,

      approvedTimesheets
    };
  }
}