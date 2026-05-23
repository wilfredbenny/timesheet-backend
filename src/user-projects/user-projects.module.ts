import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { UserProjectsController } from './user-projects.controller';

import { UserProjectsService } from './user-projects.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserProjectsController],
  providers: [UserProjectsService],
})
export class UserProjectsModule {}
