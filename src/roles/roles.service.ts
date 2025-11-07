import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './roles.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) { }
    async createRole(rolename: string): Promise<Role> {
        const newRole = new this.roleModel({ rolename });
        return newRole.save();
    }
    async getAllRoles(): Promise<Role[]> {
        return this.roleModel.find().exec();
    }
    async findById(id: string): Promise<Role> {
        const role = await this.roleModel.findById(id).exec();
        if (!role) throw new NotFoundException('Role không tồn tại');
        return role;
    }

}
