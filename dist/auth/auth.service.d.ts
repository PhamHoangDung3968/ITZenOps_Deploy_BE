import { Model } from 'mongoose';
import { UserDocument } from '../users/user.schema';
export declare class AuthService {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    validateUser(username: string, password: string): Promise<{
        _id: unknown;
        username: string | undefined;
        email: string;
        name: string;
        roleId: import("mongoose").Types.ObjectId | import("../roles/roles.schema").Role;
        sex: string | null;
        dayOfBirth: Date | null;
        lastLogin: Date;
    }>;
}
