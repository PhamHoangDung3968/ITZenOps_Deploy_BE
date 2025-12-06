"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const roles_schema_1 = require("../roles/roles.schema");
let UsersService = class UsersService {
    userModel;
    roleModel;
    constructor(userModel, roleModel) {
        this.userModel = userModel;
        this.roleModel = roleModel;
    }
    async createUser(name, email, roleId, googleData) {
        if (!email) {
            throw new Error("Email is required");
        }
        let user = await this.userModel.findOne({ email });
        if (!user) {
            if (!name) {
                name = email.split("@")[0];
            }
            const finalRoleId = roleId ?? new mongoose_2.Types.ObjectId("690ac8129504cedae7597362");
            user = new this.userModel({
                name,
                email,
                roleId: finalRoleId,
                sex: "Khác",
                ...googleData,
            });
            return user.save();
        }
        else {
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
    async getAllUsers() {
        return this.userModel.find().exec();
    }
    async updateProfile(userId, updates) {
        await this.userModel.findByIdAndUpdate(userId, updates);
        const updatedUser = await this.userModel.findById(userId).exec();
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(roles_schema_1.Role.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map