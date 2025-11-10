import { AdminsService } from '../admins/admins.service';
import { AdminDocument } from '../admins/admins.schema';
export declare class AuthService {
    private adminService;
    constructor(adminService: AdminsService);
    private readonly secret;
    validateAdmin(username: string, password: string): Promise<AdminDocument>;
    verifyToken(token: string): Promise<boolean>;
}
