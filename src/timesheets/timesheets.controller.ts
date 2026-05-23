import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { TimesheetsService } from './timesheets.service';

import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('timesheets')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class TimesheetsController {
  constructor(private timesheetsService: TimesheetsService) {}

  @Post()
  create(
    @Body()
    createTimesheetDto: CreateTimesheetDto,

    @Req()
    req: any,
  ) {
    return this.timesheetsService.create(createTimesheetDto, req.user.userId);
  }

  @Get('my')
  findMyTimesheets(
    @Req()
    req: any,
  ) {
    return this.timesheetsService.findMyTimesheets(req.user.userId);
  }

  @Patch(':id/submit')
  submitTimesheet(
    @Param('id')
    id: string,

    @Req()
    req: any,
  ) {
    return this.timesheetsService.submitTimesheet(id, req.user.userId);
  }
}
