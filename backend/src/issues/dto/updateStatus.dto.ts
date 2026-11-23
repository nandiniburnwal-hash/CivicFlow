import { IssueStatus } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class UpdateStatusDto{

    @IsString()
    @IsEnum(IssueStatus)
    status:IssueStatus;  //This says that only one of the 4 values of IssueStatus is to be used for filling the status attribute.
}