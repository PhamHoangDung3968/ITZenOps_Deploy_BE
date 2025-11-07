import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './admins.schema';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';

@Injectable()
export class AdminsService {
    constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}

    async createAdmin(username: string, password: string): Promise<Admin> {
        const hashedPassword = await argon2.hash(password);
        const newAdmin = new this.adminModel({ username, password: hashedPassword });
        return newAdmin.save();
    }

    async findByUsername(username: string): Promise<AdminDocument | null> {
        return this.adminModel.findOne({ username }).exec();
    }

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await argon2.verify(hashedPassword, password);
    }
}