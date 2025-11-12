import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    async createUser(name: string, email: string, age?: number): Promise<User> {
        const newUser = new this.userModel({ name, email, age });
        return newUser.save();
    }
    async getAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }
    // async createManyUsers(users: { name: string; email: string; age?: number }[]): Promise<User[]> {
    //     return this.userModel.insertMany(users);
    // }
    
}
