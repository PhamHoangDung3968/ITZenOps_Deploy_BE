import { Document, Types } from 'mongoose';
import { Role } from '../roles/roles.schema';
export type UserDocument = User & Document;
export declare class User {
    name: string;
    email: string;
    username?: string;
    password?: string;
    emailSent: boolean;
    dayOfBirth: Date | null;
    provider: string;
    googleId: string;
    status: number;
    lastLogin: Date;
    sex: string | null;
    roleId: Role | Types.ObjectId;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
