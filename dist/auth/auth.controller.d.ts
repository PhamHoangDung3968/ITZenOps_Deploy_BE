import type { Response } from 'express';
import type { Request } from 'express';
import { AuthService, TokenPayload } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        message: string;
        accessToken: string;
        refreshToken: string;
        user: TokenPayload;
    }>;
    googleAuth(): Promise<void>;
    googleCallback(req: Request, res: Response): Promise<void>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verify(req: Request): {
        authenticated: boolean;
        user: Express.User;
    };
    logout(req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
