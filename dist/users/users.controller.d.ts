import { UsersService } from './users.service';
import { User } from './user.schema';
import type { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(data: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
    updateProfile(req: Request, body: Partial<User>): Promise<User>;
}
