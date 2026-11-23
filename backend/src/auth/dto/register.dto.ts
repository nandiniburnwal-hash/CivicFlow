import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {

    @IsString({ message: "Name must be a string. " })
    @IsNotEmpty({ message: " Name is required" })
    @Matches(/^[\p{L}\p{N}]+(?:[ '-][\p{L}\p{N}]+)*$/u, {
        message: "Name must contain valid letters or numbers."
    })
    name: string;

    @IsEmail({}, { message: " Please enter a valid email address. " })
    @IsNotEmpty({ message: " Email is required." })
    email: string;

    @IsString({ message: " Password must be a string." })
    @MinLength(8, { message: " Password must be atleast 8 characters." })
    @IsNotEmpty({ message: "Password is required." })
    password: string;
}