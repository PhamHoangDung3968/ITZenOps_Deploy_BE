import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from '../admins/admins.service';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminsService,
    private jwtService: JwtService
  ) {}
  private readonly secret = process.env.JWT_SECRET as string;

  async validateAdmin(username: string, password: string): Promise<string> {
    const admin = await this.adminService.findByUsername(username);
    if (!admin) throw new UnauthorizedException('Admin not found');

    const isMatch = await argon2.verify(admin.password, password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');

    const payload = { sub: admin._id, username: admin.username };
    return this.jwtService.sign(payload);
  }
  async verifyToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch (err) {
      return false;
    }
  }

}