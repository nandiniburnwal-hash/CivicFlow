import { Controller, ForbiddenException, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService){}


    //API endpoint for getting all officers list
    @UseGuards(JwtAuthGuard)
    @Get('officers')
    getOfficers(@Req() req:any){

        console.log(req.user)
        if(req.user.role !== 'ADMIN')throw new ForbiddenException("Only admins are allowed to view officers list")
        return this.usersService.getOfficers();
    }
}
