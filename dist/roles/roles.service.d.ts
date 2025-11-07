import { Role, RoleDocument } from './roles.schema';
import { Model } from 'mongoose';
export declare class RolesService {
    private roleModel;
    constructor(roleModel: Model<RoleDocument>);
    createRole(rolename: string): Promise<Role>;
    getAllRoles(): Promise<Role[]>;
    findById(id: string): Promise<Role>;
}
