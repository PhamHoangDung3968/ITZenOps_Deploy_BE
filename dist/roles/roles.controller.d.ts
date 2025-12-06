import { RolesService } from './roles.service';
import { Role } from './roles.schema';
import type { Request } from 'express';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(data: Partial<Role>, req: Request): Promise<Role>;
    findAll(): Promise<Role[]>;
    getRoleById(id: string): Promise<Role>;
}
