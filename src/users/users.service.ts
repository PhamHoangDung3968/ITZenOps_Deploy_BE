import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Role, RoleDocument } from '../roles/roles.schema';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    ) { }

    async createUser(
        name: string,
        email: string,
        roleId?: Types.ObjectId,
        googleData?: { googleId: string; provider: string; lastLogin?: Date }
    ): Promise<User> {
        if (!email) {
            throw new Error("Email is required");
        }

        // Tìm user theo email
        let user = await this.userModel.findOne({ email });

        if (!user) {
            // Nếu chưa có thì tạo mới
            if (!name) {
                name = email.split("@")[0];
            }
            const finalRoleId = roleId ?? new Types.ObjectId("690ac8129504cedae7597362");

            user = new this.userModel({
                name,
                email,
                roleId: finalRoleId,
                sex: "Khác", // mặc định
                ...googleData, // nếu có dữ liệu từ Google
            });

            return user.save();
        } else {
            // Nếu đã có email trong DB nhưng chưa login lần nào → cập nhật thông tin từ Google
            if (googleData) {
                user.googleId = googleData.googleId;
                user.provider = googleData.provider;
                user.lastLogin = googleData.lastLogin ?? new Date();
            }
            if (name) {
                user.name = name;
            }
            if (roleId) {
                user.roleId = roleId;
            }

            return user.save();
        }
    }

    async getAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
        await this.userModel.findByIdAndUpdate(userId, updates);
        const updatedUser = await this.userModel.findById(userId).exec();

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    }


}
