import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller.js';
import { IssuesService } from './issues.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

//Connects issues.service.ts and iccues.controler.ts together so NestJS knows they belong to the issues feauture

@Module({
  imports:[PrismaModule, AuthModule,],
  controllers: [IssuesController],
  providers: [IssuesService]
})
export class IssuesModule {}
