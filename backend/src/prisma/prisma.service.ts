//Making Prisma available inside NestJS

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
//The below line says that PrismaService inherits all Prisma database methods
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit(){
        await this.$connect();
    }
}
