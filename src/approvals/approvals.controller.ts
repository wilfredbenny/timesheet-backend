import {
  Body,
  Controller,
  Param,
  Patch,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { ApprovalsService } from './approvals.service';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApprovalActionDto } from './dto/approval-action.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('approvals')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  // @Get()
  // getApprovals(
  //   @Req()
  //   req: any,

  //   @Query()
  //   paginationDto: PaginationDto,
  // ) {
  //   return this.approvalsService.getApprovals(
  //     req.user.userId,

  //     paginationDto,
  //   );
  // }

  @Get('pending')

  getPendingApprovals(

    @Req()
    req: any
  ) {

    return this.approvalsService
      .getPendingApprovals(
        req.user.userId
      );
  }

  @Patch(':id/action')
  actionTimesheet(
    @Param('id')
    id: string,

    @Body()
    approvalActionDto: ApprovalActionDto,

    @Req()
    req: any,
  ) {
    return this.approvalsService.actionTimesheet(
      id,
      approvalActionDto,
      req.user.userId,
    );
  }

  @Get('dashboard')
  getDashboard(
    @Req()
    req: any,
  ) {
    return this.approvalsService.getManagerDashboard(req.user.userId);
  }

  @Get('reports/monthly')
  getMonthlyReport(
    @Req()
    req: any,
  ) {
    return this.approvalsService.getMonthlyEmployeeReport(req.user.userId);
  }
}
