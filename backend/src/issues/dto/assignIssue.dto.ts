import { IsUUID } from "class-validator";

export class AssignIssueDto{
    @IsUUID()
    officerId : string;  //refers to id of the officer who will be assigned
}