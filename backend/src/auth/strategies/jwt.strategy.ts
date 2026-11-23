import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

//Strategy => Implementation that knows how to authenticate req using JWTs
//ExtractJwt => provides helper function to find a JWT in an incoming request
//ConfigService => Makes the values loaded from .env 

@Injectable()

//PassportStrategy(Strategy) connects the passport-jwt startegy to NestJS Passport
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(configService: ConfigService){

        //Calling the parents class's constructor
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  //It extracts the token present after the word bearer
            ignoreExpiration:false,  //This tells Passport to reject a token that has already expired
            secretOrKey:configService. getOrThrow<string>('JWT_SECRET'),  //It retrieves the JWT_SECRET from .env config and uses it to verify incoming JWT tokens, throwing error if secret is missing
        });
    }

    //Represents the return of an aunthenticated user
    async validate(payload: any){
        return{
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        }
    }
}
