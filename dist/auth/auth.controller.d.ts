import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        message: string;
        sessionId: string;
        user: {
            _id: unknown;
            username: string | undefined;
            email: string;
            name: string;
            roleId: import("mongoose").Types.ObjectId | import("../roles/roles.schema").Role;
            sex: string | null;
            dayOfBirth: Date | null;
            lastLogin: Date;
        };
    }>;
    verify(req: Request): {
        authenticated: boolean;
        user: Express.User | undefined;
    };
    logout(sessionId: string): {
        success: boolean;
    };
}
