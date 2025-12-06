import type { Request, Response } from 'express';
import { AuthService, TokenPayload } from './auth.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    private setRefreshTokenCookie;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(body: {
        username: string;
        password: string;
    }, res: Response): Promise<{
        message: string;
        accessToken: string;
        user: TokenPayload;
    }>;
    refreshTokens(req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    verify(req: Request): {
        authenticated: boolean;
        user: Express.User;
    };
    logout(req: Request, res: Response): Promise<{
        success: boolean;
        message: string;
    }>;
}
