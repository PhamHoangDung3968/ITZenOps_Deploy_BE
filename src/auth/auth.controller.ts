import {
  Controller,
  Post,
  Body,
  Get,
  UnauthorizedException,
  Headers,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from '../admins/dto/create-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) { }

  // ✅ Đăng nhập bằng username/password cho admin
  @Post('login')
  async login(@Body() dto: CreateAdminDto) {
    const token = await this.authService.validateAdmin(dto.username, dto.password);
    return { access_token: token };
  }

  // ✅ Xác thực token
  @Get('verify')
  async verify(@Headers('authorization') authHeader: string) {
    if (!authHeader) throw new UnauthorizedException('Missing token');

    const token = authHeader.replace('Bearer ', '');
    const isValid = await this.authService.verifyToken(token);

    if (!isValid) throw new UnauthorizedException('Invalid or expired token');
    return { message: 'Token is valid' };
  }

  // ✅ Bắt đầu đăng nhập bằng Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport sẽ tự redirect đến Google
  }

  // ✅ Callback sau khi Google xác thực
  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req) {
  //   const user = req.user;
  //   const token = this.jwtService.sign({ sub: user._id, email: user.email });
  //   return {
  //     message: 'Đăng nhập Google thành công!',
  //     user,
  //     access_token: token,
  //   };
  // }
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;

    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      username: user.name,
      role: user.roleId, // hoặc populate trước nếu cần tên role
    });

    const html = `
    <script>
      window.opener.postMessage({
        access_token: '${token}',
        username: '${user.name}',
        email: '${user.email}',
        sex: '${user.sex ?? ''}',
        roleId: '${user.roleId ?? ''}',
        dayOfBirth: '${user.dayOfBirth ?? ''}',
        lastLogin: '${user.lastLogin ?? ''}'
      }, 'http://localhost:3001');
      window.close();
    </script>
  `;
    res.send(html);
  }
}