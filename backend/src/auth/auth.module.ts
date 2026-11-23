import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { JwtModule } from '@nestjs/jwt';
import {  ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { PassportModule } from '@nestjs/passport';


//PrismaModule => provides access to Prismaservice
//PassportModule => integrates Passport with NestJS
//JwtModule.registerAsync() => configure JWT module using values obtained at runtime

@Module({
  imports: [
    PrismaModule, 
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(configService: ConfigService)=>({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions:{
          expiresIn: '15m',
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  //AuthService => contains registration and login logic
  //JwtStrategy => contains the logic for verifying JWTs

  exports:[JwtAuthGuard, AuthService],

  
})
export class AuthModule {}

//AuthService needs PrismaServivve to save registred users.
//importing PrismaModule makes its exported PrismaService available to this module.


//registerAsync => allows the JWT config to be loaded through NestJS dependency
//inject:[ConfigService] => tells NestJS to provide ConfigService to the factory
//useFactory => creates JWT config obj
//secret => 
//expiresIn => Says that each token expires in 15 mins.
