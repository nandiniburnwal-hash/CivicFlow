import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
export class CreateIssueDto{

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    title:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(500)
    description:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    category:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    location:string;
}