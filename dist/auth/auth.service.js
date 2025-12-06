"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/user.schema");
const argon2 = __importStar(require("argon2"));
const jwt_1 = require("@nestjs/jwt");
const redis_service_1 = require("../redis/redis.service");
let AuthService = class AuthService {
    userModel;
    jwtService;
    redisService;
    constructor(userModel, jwtService, redisService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.redisService = redisService;
    }
    async validateUser(username, password) {
        const user = await this.userModel.findOne({ username });
        if (!user) {
            throw new common_1.UnauthorizedException('Tài khoản không tồn tại');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Tài khoản không có mật khẩu');
        }
        const isValid = await argon2.verify(user.password, password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Sai mật khẩu');
        }
        const allowedRoleId = '690ac7fd9504cedae759735e';
        if (String(user.roleId) !== allowedRoleId) {
            throw new common_1.UnauthorizedException('Không có quyền đăng nhập bằng tài khoản thường');
        }
        user.lastLogin = new Date();
        await user.save();
        return {
            _id: String(user._id),
            username: user.username,
            email: user.email,
            name: user.name,
            roleId: String(user.roleId),
            sex: user.sex ?? null,
            dayOfBirth: user.dayOfBirth ?? null,
            lastLogin: user.lastLogin,
        };
    }
    async validateUserById(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.UnauthorizedException('User không tồn tại');
        return {
            _id: String(user._id),
            username: user.username,
            email: user.email,
            name: user.name,
            roleId: String(user.roleId),
            sex: user.sex ?? null,
            dayOfBirth: user.dayOfBirth ?? null,
            lastLogin: user.lastLogin,
        };
    }
    async getTokens(payload) {
        const accessToken = this.jwtService.sign({
            _id: payload._id,
            username: payload.username,
            email: payload.email,
            name: payload.name,
            roleId: payload.roleId,
            sex: payload.sex,
            dayOfBirth: payload.dayOfBirth,
            lastLogin: payload.lastLogin,
        }, { expiresIn: '1d' });
        const refreshToken = this.jwtService.sign({ userId: payload._id }, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(userId, refreshToken) {
        const redis = this.redisService.getClient();
        await redis.set(`refresh:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
    }
    async getStoredRefreshToken(userId) {
        const redis = this.redisService.getClient();
        return redis.get(`refresh:${userId}`);
    }
    async removeRefreshToken(userId) {
        const redis = this.redisService.getClient();
        await redis.del(`refresh:${userId}`);
    }
    async verifyRefreshToken(refreshToken) {
        try {
            return this.jwtService.verify(refreshToken);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map