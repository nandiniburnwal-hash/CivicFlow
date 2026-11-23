import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";

@Global()  //Make this provider available throughout the application without having to import PrismModule in every feature module
@Module({
    providers:[PrismaService],
    exports: [PrismaService],
})
export class PrismaModule{}