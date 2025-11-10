import { AuthService } from './auth.service';
import { CreateAdminDto } from '../admins/dto/create-admin.dto';
import type { Request, Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: CreateAdminDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    verify(req: Request): Promise<{
        type: string;
        user: {
            id: string;
            username: string;
            role: string;
        };
    } | {
        type: string;
        user: {
            id: string;
            email: string;
            username: string;
            roleId?: string;
            sex?: string;
            dayOfBirth?: string;
            lastLogin?: string;
        };
    }>;
    logout(req: Request, res: Response): Response<any, Record<string, any>>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
}
