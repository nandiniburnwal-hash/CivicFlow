import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {

    constructor( 
        private prisma: PrismaService,
        private jwtService: JwtService,
    ){}

    async register(data : RegisterDto){
        const {name, email, password}=data;
        const existUser=await this.prisma.user.findUnique({
            where:{email},
        })

        if(existUser){
            throw new ConflictException("Email already registered");
        }

        const hashPswrd=await bcrypt.hash(password, 10);

        const user=await this.prisma.user.create({
            data:{
                name, 
                email,
                password: hashPswrd,
            },

            //Here true means include this field in the returned result
            select:{
                id:true,
                name:true,
                email:true,
                role:true,
                createdAt:true,
            },
        });

        return {
            message:"Registration successfull",
            user,
        };

    }

    async login(data: LoginDto){
        const user=await this.prisma.user.findUnique({
            where:{
                email:data.email,
            }
        });

        if(!user)throw new UnauthorizedException("Invalid email or password");

        const isPasswordValid=await bcrypt.compare(data.password, user.password);

        if(!isPasswordValid)throw new UnauthorizedException("Invalid email or password");

        const payload={
            sub:user.id,
            email:user.email,
            role:user.role,
        };

        const accessToken=await this.jwtService.signAsync(payload);

        return{
            access_token:accessToken,
        };
    }
}
