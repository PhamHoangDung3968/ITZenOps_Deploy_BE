// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   UnauthorizedException,
//   Headers,
//   Req,
//   UseGuards,
//   Res,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateAdminDto } from '../admins/dto/create-admin.dto';
// import { AuthGuard } from '@nestjs/passport';
// import { JwtService } from '@nestjs/jwt';
// import type { Request, Response } from 'express';

// @Controller('auth')
// export class AuthController {
//   constructor(
//     private authService: AuthService,
//     private jwtService: JwtService,
//   ) { }

//   // ✅ Đăng nhập bằng username/password cho admin
//   @Post('login')
//   async login(@Body() dto: CreateAdminDto) {
//     const token = await this.authService.validateAdmin(dto.username, dto.password);
//     return { access_token: token };
//   }

//   // ✅ Xác thực token
//   @Get('verify')
//   async verify(@Headers('authorization') authHeader: string) {
//     if (!authHeader) throw new UnauthorizedException('Missing token');

//     const token = authHeader.replace('Bearer ', '');
//     const isValid = await this.authService.verifyToken(token);

//     if (!isValid) throw new UnauthorizedException('Invalid or expired token');
//     return { message: 'Token is valid' };
//   }

//   // ✅ Bắt đầu đăng nhập bằng Google
//   @Get('google')
//   @UseGuards(AuthGuard('google'))
//   async googleAuth() {
//     // Passport sẽ tự redirect đến Google
//   }

//   // ✅ Callback sau khi Google xác thực
//   // @Get('google/callback')
//   // @UseGuards(AuthGuard('google'))
//   // async googleAuthRedirect(@Req() req) {
//   //   const user = req.user;
//   //   const token = this.jwtService.sign({ sub: user._id, email: user.email });
//   //   return {
//   //     message: 'Đăng nhập Google thành công!',
//   //     user,
//   //     access_token: token,
//   //   };
//   // }
//   @Get('google/callback')
//   @UseGuards(AuthGuard('google'))
//   async googleAuthRedirect(@Req() req, @Res() res: Response) {
//     const user = req.user;

//     const token = this.jwtService.sign({
//       sub: user._id,
//       email: user.email,
//       username: user.name,
//       role: user.roleId, // hoặc populate trước nếu cần tên role
//     });

//     const html = `
//     <script>
//       window.opener.postMessage({
//         access_token: '${token}',
//         username: '${user.name}',
//         email: '${user.email}',
//         sex: '${user.sex ?? ''}',
//         roleId: '${user.roleId ?? ''}',
//         dayOfBirth: '${user.dayOfBirth ?? ''}',
//         lastLogin: '${user.lastLogin ?? ''}'
//       }, 'http://localhost:3001');
//       window.close();
//     </script>
//   `;
//     res.send(html);
//   }
// }














import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Headers,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { createSession, deleteSession } from './session.store';
import { SessionGuard } from './session.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ Đăng nhập bằng Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  // ✅ Callback sau khi Google xác thực
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    if (!user) return res.status(400).send('User not found');

    const sessionId = createSession({
      _id: user['_id'],
      email: user['email'],
      name: user['name'],
      roleId: user['roleId'],
      sex: user['sex'],
      dayOfBirth: user['dayOfBirth'],
      lastLogin: user['lastLogin'],
    });

    const html = `
      <script>
        window.opener.postMessage({
          sessionId: '${sessionId}',
          username: '${user['name']}',
          email: '${user['email']}',
          sex: '${user['sex'] ?? ''}',
          roleId: '${user['roleId'] ?? ''}',
          dayOfBirth: '${user['dayOfBirth'] ?? ''}',
          lastLogin: '${user['lastLogin'] ?? ''}'
        }, 'https://itzenops.vercel.app');
        window.close();
      </script>
    `;
    res.send(html);
  }

  // ✅ Đăng nhập bằng tài khoản thường
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);

    const sessionId = createSession({
      _id: user._id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      sex: user.sex,
      dayOfBirth: user.dayOfBirth,
      lastLogin: user.lastLogin,
    });

    return {
      message: 'Đăng nhập thành công',
      sessionId,
      user,
    };
  }

  // ✅ Kiểm tra session
  @Get('verify')
  @UseGuards(SessionGuard)
  verify(@Req() req: Request) {
    return {
      authenticated: true,
      user: req.user,
    };
  }

  // ✅ Đăng xuất
  @Post('logout')
  logout(@Headers('x-session-id') sessionId: string) {
    deleteSession(sessionId);
    return { success: true };
  }
}