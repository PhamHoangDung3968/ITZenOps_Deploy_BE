import { Admin, AdminDocument } from './admins.schema';
import { Model } from 'mongoose';
export declare class AdminsService {
    private adminModel;
    constructor(adminModel: Model<AdminDocument>);
    createAdmin(username: string, password: string): Promise<Admin>;
    findByUsername(username: string): Promise<AdminDocument | null>;
    validatePassword(password: string, hashedPassword: string): Promise<boolean>;
}
