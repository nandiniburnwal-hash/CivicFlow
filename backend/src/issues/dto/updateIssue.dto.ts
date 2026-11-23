import {PartialType} from '@nestjs/mapped-types';
import { CreateIssueDto } from "./createIssue.dto.js";

export class UpdateIssueDto extends PartialType(CreateIssueDto){
    title:string;
    description:string;
    category:string;
    location:string;

}