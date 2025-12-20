import { UsersService } from './users.service';
import { User } from './user.schema';
import type { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(data: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
    updateProfile(req: Request, body: Partial<User>): Promise<User>;
    findOne(id: string): Promise<User | null>;
    updateUser(id: string, updates: Partial<User>): Promise<User>;
    updateUserRole(id: string, roleId: string): Promise<User>;
    updateSex(id: string, sex: string): Promise<User>;
    updateStatus(id: string, status: number): Promise<User>;
    createManualUser(data: Partial<User>): Promise<User>;
    deleteUser(id: string): Promise<void>;
}
