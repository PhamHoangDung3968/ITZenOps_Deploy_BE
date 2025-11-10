import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(name: string, email: string, age?: number): Promise<User>;
    getAllUsers(): Promise<User[]>;
    findUserById(id: string): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
}
