import { AuthService } from './auth.service';
import { CreateAdminDto } from '../admins/dto/create-admin.dto';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(dto: CreateAdminDto): Promise<{
        access_token: string;
    }>;
    verify(authHeader: string): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
}
