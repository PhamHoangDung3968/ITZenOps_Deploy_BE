import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User, UserDocument } from './user.schema';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
    async createUser(name: string, email: string, age?: number): Promise<User> {
        const newUser = new this.userModel({ name, email, age });
        return newUser.save();
    }
    async getAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }
    async findUserById(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('User không tồn tại');
        return user;
    }
    async update(id: string, data: Partial<User>): Promise<User> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('ID không hợp lệ');
        }

        const updatedUser = await this.userModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            throw new NotFoundException('Không tìm thấy người dùng để cập nhật');
        }

        return updatedUser;
    }

    // async createManyUsers(users: { name: string; email: string; age?: number }[]): Promise<User[]> {
    //     return this.userModel.insertMany(users);
    // }

    
}
