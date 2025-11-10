import { UsersService } from './users.service';
import { User } from './user.schema';
import type { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUserById(id: string): Promise<User>;
    updateUserById(id: string, dto: Partial<User>, req: Request): Promise<User>;
}
