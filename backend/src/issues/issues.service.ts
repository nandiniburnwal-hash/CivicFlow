import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateIssueDto } from './dto/updateIssue.dto.js';
import { UpdateStatusDto } from './dto/updateStatus.dto.js';
import { Prisma, UserRole } from '@prisma/client';
import { AssignIssueDto } from './dto/assignIssue.dto.js';

//Connects the actual logic for creating, finding, updating and deleting issues

@Injectable()
export class IssuesService {
    //The below line says to inject PrismaService
    constructor(private readonly prisma: PrismaService){}


    //To create an issue
    async createIssue(data: {
        title: string;
        description: string;
        category: string;
        location: string;
    },
    userId: string,
){
        return this.prisma.issue.create({
            data:{
                ...data,
                userId:userId,
            }
        })  //Inserts a new record in Issue table
    }


    //To get all issues
    //findMany => Returns all the issues
    //orderBy => Returns the newest issue first
    async getAllIssues(
        user:{ id:string, role: UserRole},
        page: number=1,
        limit: number = 10,
        search:string ='',
        status:string='',
    ){
        const skip=(page-1)*limit; //It tells prisma how many records to skip
        

        //Apply role-based filtering
        let where: Prisma.IssueWhereInput={};

        if(user.role === UserRole.OFFICER){
            where ={assignedToId: user.id};
        }else if(user.role===UserRole.CITIZEN){
            where = {userId: user.id};
        } 

        //Apply search filtering
        //OR means searches across title, desc, location
        //insensitive => case insensitive
        if(search.trim()){
            where={
                ...where, //conserves the role based condition
                OR:[
                    {title:{contains: search.trim(), mode:'insensitive'}},
                    {description:{contains: search.trim(), mode:'insensitive'}},
                    {location:{contains:search.trim(), mode:'insensitive'}},
                ],
            };
        }
        

        //Apply status filtering
        if(status){
            where={
                ...where,
                status:status as Prisma.EnumIssueStatusFilter,
            };
        }


        //Fetch issues and total count of issues simultaneously
        //Promise.all() exceutes both operations concurrently insteadof waiting for one to finish before starting another.
        const [issues, totalIssues] = await Promise.all([
            this.prisma.issue.findMany({  //findMany fetches all the issues for the requested page
                where,
                orderBy:{createdAt:'desc'},
                skip,
                take:limit,
            }),
            
            //count all issues matching the same role-based filter
            this.prisma.issue.count({
                where,
            }),
        ]);


        return{
            data:issues,
            meta:{
                page,
                limit,
                totalIssues,
                totalPages: Math.ceil(totalIssues/limit),
            },
        };
    }


    //To get an issue by id
    //findUnique => Find a single issue whose id matches the id provided as parameter
    async getIssueById(
        id:string,
        currUser:{id:string, role:UserRole}
    ){
        const issue= await this.prisma.issue.findUnique({
            where:{id,},
        });
        if(!issue)throw new NotFoundException("Issue not found");

        //A citizen attempting to view someone else's issue receieves Forbidden Error
        if(
            issue.userId!== currUser.id &&
            currUser.role !== UserRole.ADMIN
        ){
            throw new ForbiddenException("You are not allowed to view this issue.")
        }

        return issue;
    }



    async updateIssue(id:string, data:UpdateIssueDto, currentUser:{id:string, role:string},){
        const issue= await this.prisma.issue.findUnique({
            where:{id:id,},
        });
        if(!issue)throw new NotFoundException("Issue not found");
        if(issue.userId!==currentUser.id && currentUser.role!=='ADMIN')throw new ForbiddenException("You are not allowed to update this issue");
        return this.prisma.issue.update({
            where:{id},
            data,
        });
    }


    async deleteIssue(id:string, currentUser:{id:string, role:string}){
        const issue=await this.prisma.issue.findUnique({
            where:{id:id},
        });

        if(!issue)throw new NotFoundException("Issue not found");
        if(issue.userId!==currentUser.id && currentUser.role !== 'ADMIN')throw new ForbiddenException("You are not allowed to delete this user");
        return this.prisma.issue.delete({
            where:{id},
        });
    }


    async updateStatus(id:string, data:UpdateStatusDto, currentUser:{id:string, role:string}){

        const issue=await this.prisma.issue.findUnique({
            where:{
                id:id,
            }
        });
        
        if(!issue)throw new NotFoundException("Issue Not Found");
        
        //Check whether the user logging is admin or an officer or not
        if(currentUser.role!=='ADMIN' && currentUser.role!== 'OFFICER')throw new ForbiddenException("Only admins and officers are allowed to update issue status");

        //Officers can only update the issue assigned to them
        if(currentUser.role==='OFFICER' && issue.assignedToId!== currentUser.id)throw new ForbiddenException("You can update only issues assigned to you.")

        //Here nextStatus didn't discover the 4 statuses.
        //issue.status was known by ts that it could have any of 4 status so nextStatus[issue.status] also got the status when we didn'twrote for RESOLVED attribute
        const nextStatus={
            REPORTED:"ASSIGNED",
            ASSIGNED:"IN_PROGRESS",
            IN_PROGRESS:"RESOLVED",
            RESOLVED:undefined
        };

        if(nextStatus[issue.status]!==data.status){
            throw new BadRequestException("Wrong status assigned");
        }

        return await this.prisma.issue.update({
            where:{
                id:id,
            },
            data:{
                status:data.status,
            }
        })
    }


    // Method for assigning issue to the officer
    async assignIssue(id: string, data: AssignIssueDto){
        const issue=await this.prisma.issue.findUnique({
            where:{id},
        })

        if(!issue)throw new NotFoundException("Issue not found");

        const officer= await this.prisma.user.findUnique({
            where:{id: data.officerId},
        })

        if(!officer || officer.role !== UserRole.OFFICER){
            throw new BadRequestException(" Invald officer ID");
        }

        return this.prisma.issue.update({
            where:{id},
            data:{
                assignedToId : officer.id,
                status:'ASSIGNED',
            },
            include:{   //Now the response contains the id, name, email of the assigned officer along with the id and status of the issue
                assignedTo:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                    }
                }
            }
        });
    }
}
