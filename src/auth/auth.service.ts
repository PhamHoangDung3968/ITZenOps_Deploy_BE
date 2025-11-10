import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminsService } from '../admins/admins.service';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { AdminDocument } from '../admins/admins.schema';

@Injectable()
export class AuthService {
  constructor(private adminService: AdminsService) {}

  private readonly secret = process.env.JWT_SECRET as string;

  // ✅ Xác thực admin và trả về thông tin để lưu vào session
  async validateAdmin(username: string, password: string): Promise<AdminDocument> {
    const admin = await this.adminService.findByUsername(username);
    if (!admin) throw new UnauthorizedException('Admin not found');

    const isMatch = await argon2.verify(admin.password, password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');

    return admin;
  }

  // ✅ Dùng cho xác thực token Google OAuth nếu cần
  async verifyToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch (err) {
      return false;
    }
  }
}