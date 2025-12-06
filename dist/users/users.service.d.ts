import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { RoleDocument } from '../roles/roles.schema';
export declare class UsersService {
    private userModel;
    private roleModel;
    constructor(userModel: Model<UserDocument>, roleModel: Model<RoleDocument>);
    createUser(name: string, email: string, roleId?: Types.ObjectId, googleData?: {
        googleId: string;
        provider: string;
        lastLogin?: Date;
    }): Promise<User>;
    getAllUsers(): Promise<User[]>;
    updateProfile(userId: string, updates: Partial<User>): Promise<User>;
}
