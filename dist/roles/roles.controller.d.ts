import { RolesService } from './roles.service';
import { Role } from './roles.schema';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(data: Partial<Role>, req: any): Promise<Role>;
    findAll(): Promise<Role[]>;
    getRoleById(id: string): Promise<Role>;
}
