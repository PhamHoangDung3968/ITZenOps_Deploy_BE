import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async validateUser(username: string, password: string) {
    // 🔍 Tìm người dùng theo username
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    // 🔒 Kiểm tra mật khẩu có tồn tại không (tránh tài khoản Google)
    if (!user.password) {
      throw new UnauthorizedException('Tài khoản không có mật khẩu');
    }

    // 🔐 So sánh mật khẩu đã hash
    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException('Sai mật khẩu');
    }

    // ✅ Chỉ cho phép đăng nhập nếu role là đặc biệt
    const allowedRoleId = '690ac7fd9504cedae759735e';
    if (String(user.roleId) !== allowedRoleId) {
      throw new UnauthorizedException('Không có quyền đăng nhập bằng tài khoản thường');
    }

    // 🕒 Cập nhật thời gian đăng nhập
    user.lastLogin = new Date();
    await user.save();

    // ✅ Trả về thông tin người dùng
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      sex: user.sex,
      dayOfBirth: user.dayOfBirth,
      lastLogin: user.lastLogin,
    };
  }
}