import { Controller, Post, Body, Get, Param, Patch, Delete, ValidationPipe, ParseUUIDPipe, UseGuards, Req, ForbiddenException, Query } from '@nestjs/common';
import { IssuesService } from './issues.service.js';
import { CreateIssueDto } from './dto/createIssue.dto.js';
import { UpdateIssueDto } from './dto/updateIssue.dto.js';
import { UpdateStatusDto } from './dto/updateStatus.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AssignIssueDto } from './dto/assignIssue.dto.js';

//Hadle HTTPS requests

@Controller('issues')
export class IssuesController {
    constructor(private readonly issueService: IssuesService) { }


    //Report an issue
    // @Req() req : gives us the access to request
    @UseGuards(JwtAuthGuard)
    @Post()
    createIssue(
        @Body(new ValidationPipe()) data: CreateIssueDto,
        @Req() req: any,
    ) {
        return this.issueService.createIssue(data, req.user.id);
    }

    //Get all issues
    @UseGuards(JwtAuthGuard) //putting this guard means that only authenticated users can view the issues.
    @Get()
    getAllIssues(
        @Req() req: any,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('search') search: string ='',
        @Query('status') status: string= '',
    ) {


        return this.issueService.getAllIssues(
            req.user,
            Math.max(1, parseInt(page, 10) || 1),  //provides the larger of the given values
            Math.min(100, Math.max(1, parseInt(limit, 10) || 10)),   // provides the smaller value

            //We make this combination to keep a value between 1 and 100
            // || provides a fallback when the left value is falsy
            search,
            status,
        );
    }


    //Assigning the issue to officer endpoint
    @UseGuards(JwtAuthGuard)
    @Patch(':id/assign')
    assignIssue(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body(new ValidationPipe()) data: AssignIssueDto,
        @Req() req: any,
    ) {
        if (req.user.role !== 'ADMIN') {
            throw new ForbiddenException("Only admins can assign issues.")
        }

        return this.issueService.assignIssue(id, data); //this is written to match with issue.service and assign the issue to desired officer.
    }


    @UseGuards(JwtAuthGuard)
    //Get an issue by id
    @Get(':id') //provided a dynamic route
    //@Param('id') means take id param from the url and use that in the id variable 
    getIssueById(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Req() req: any
    ) {
        return this.issueService.getIssueById(id, req.user);
    }


    //Update an issue
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateIssue(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body(new ValidationPipe()) data: UpdateIssueDto,
        @Req() req: any,
    ) {
        return this.issueService.updateIssue(id, data, req.user);
    }


    //Delete an issue
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteIssue(@Param('id', new ParseUUIDPipe()) id: string,
        @Req() req: any,
    ) {
        return this.issueService.deleteIssue(id, req.user);
    }


    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    updateStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() data: any,
        @Req() req: any
    ) {
        return this.issueService.updateStatus(id, data, req.user);
    }


}

