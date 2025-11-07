import { JwtService } from '@nestjs/jwt';
import { AdminsService } from '../admins/admins.service';
export declare class AuthService {
    private adminService;
    private jwtService;
    constructor(adminService: AdminsService, jwtService: JwtService);
    private readonly secret;
    validateAdmin(username: string, password: string): Promise<string>;
    verifyToken(token: string): Promise<boolean>;
}
