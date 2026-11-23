import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}


//AuthGuard => provides Passport's authentication guard
//AuthGuard('jwt') => tells Passport to use the strategy registered under the name jwt
//extends AuthGuard('jwt') => creates our own reusable guard