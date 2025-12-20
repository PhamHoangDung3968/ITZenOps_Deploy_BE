import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import * as argon2 from 'argon2';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Xác thực user bằng username/password (từ DB)
   */
  async validateUser(username: string, password: string): Promise<TokenPayload> {
    const user = await this.userModel.findOne({ username });
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại');
    if (!user.password) throw new UnauthorizedException('Tài khoản không có mật khẩu');

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) throw new UnauthorizedException('Sai mật khẩu');

    const allowedRoleId = '690ac7fd9504cedae759735e';
    if (String(user.roleId) !== allowedRoleId) {
      throw new UnauthorizedException('Không có quyền đăng nhập bằng tài khoản thường');
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

  /**
   * Lấy user từ DB qua userId
   */
  async validateUserById(userId: string): Promise<TokenPayload> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User không tồn tại');

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

  /**
   * Sinh Access Token và Refresh Token
   */
  async getTokens(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(
      {
        _id: payload._id,
        username: payload.username,
        email: payload.email,
        name: payload.name,
        roleId: payload.roleId,
        sex: payload.sex,
        dayOfBirth: payload.dayOfBirth,
        lastLogin: payload.lastLogin,
      },
      { expiresIn: '1d' },
    );

    const refreshToken = this.jwtService.sign(
      { userId: payload._id },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  /**
   * Lưu Refresh Token vào Redis
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    const redis = this.redisService.getClient();
    await redis.set(`refresh:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
  }

  /**
   * Lấy Refresh Token từ Redis
   */
  async getStoredRefreshToken(userId: string): Promise<string | null> {
    const redis = this.redisService.getClient();
    return redis.get(`refresh:${userId}`);
  }

  /**
   * Xóa Refresh Token trong Redis
   */
  async removeRefreshToken(userId: string) {
    const redis = this.redisService.getClient();
    await redis.del(`refresh:${userId}`);
  }

  /**
   * Verify Refresh Token
   */
  async verifyRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
    }
  }

  // ============================
  // BLACKLIST / WHITELIST JWT
  // ============================

  /**
   * Đưa Access Token vào blacklist
   */
  async blacklistAccessToken(token: string) {
    const decoded: any = this.jwtService.decode(token);
    if (!decoded?.exp) return;
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    const redis = this.redisService.getClient();
    await redis.set(`blacklist:${token}`, 'true', 'EX', ttl);
  }

  /**
   * Đưa Access Token vào whitelist
   */
  async whitelistAccessToken(token: string) {
    const decoded: any = this.jwtService.decode(token);
    if (!decoded?.exp) return;
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    const redis = this.redisService.getClient();
    await redis.set(`whitelist:${token}`, 'true', 'EX', ttl);
  }

  /**
   * Kiểm tra token có bị blacklist không
   */
  async isAccessTokenBlacklisted(token: string): Promise<boolean> {
    const redis = this.redisService.getClient();
    const result = await redis.get(`blacklist:${token}`);
    return result === 'true';
  }

  /**
   * Kiểm tra token có nằm trong whitelist không
   */
  async isAccessTokenWhitelisted(token: string): Promise<boolean> {
    const redis = this.redisService.getClient();
    const result = await redis.get(`whitelist:${token}`);
    return result === 'true';
  }
}