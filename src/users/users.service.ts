import { Injectable, NotFoundException } from '@nestjs/common';
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
        let user = await this.userModel.findOne({ email });
        if (!user) {
            if (!name) {
                name = email.split("@")[0];
            }
            const finalRoleId = roleId ?? new Types.ObjectId("690ac8129504cedae7597362");
            user = new this.userModel({
                name,
                email,
                roleId: finalRoleId,
                sex: "Khác",
                ...googleData,
            });
            return user.save();
        } else {
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

    async getUserById(userId: string): Promise<User | null> {
        return this.userModel.findById(userId).exec();
    }

    async updateUserRole(userId: string, roleId: string): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { roleId: new Types.ObjectId(roleId) },
            { new: true }
        ).exec();

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    }

    async updateSex(userId: string, sex: string): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { sex },
            { new: true }
        ).exec();
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }

    async updateStatus(userId: string, status: number): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { status },
            { new: true }
        ).exec();
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }

    async updateUser(userId: string, updates: Partial<User>): Promise<User> {
        delete updates.email;
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            updates,
            { new: true }
        ).exec();
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }

    async createManualUser(data: Partial<User>): Promise<User> {
        const newUser = new this.userModel({
            ...data,
            status: data.status ?? 1,
            lastLogin: null,
            emailSent: false,
        });
        return newUser.save();
    }

    // Tại UsersService
    async deleteUser(userId: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(userId).exec();
        if (!result) {
            throw new NotFoundException(`Không tìm thấy người dùng với ID: ${userId}`);
        }
    }


}
