import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async getOfficers(){
        return this.prisma.user.findMany({
            where:{
                role: UserRole.OFFICER,
            },
            select:{
                id:true,
                name:true,
                email:true,
            },
        });
    }
}
