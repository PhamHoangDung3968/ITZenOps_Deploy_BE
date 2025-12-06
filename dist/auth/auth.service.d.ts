import { Model } from 'mongoose';
import { UserDocument } from '../users/user.schema';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
export interface TokenPayload {
    _id: string;
    username?: string;
    email: string;
    name: string;
    roleId: string;
    sex: string | null;
    dayOfBirth: Date | null;
    lastLogin?: Date;
}
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    private readonly redisService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, redisService: RedisService);
    validateUser(username: string, password: string): Promise<TokenPayload>;
    validateUserById(userId: string): Promise<TokenPayload>;
    getTokens(payload: TokenPayload): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    getStoredRefreshToken(userId: string): Promise<string | null>;
    removeRefreshToken(userId: string): Promise<void>;
    verifyRefreshToken(refreshToken: string): Promise<any>;
}
