import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService, TokenPayload } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    const secure = this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      path: '/',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    });
  }

  // Đăng nhập bằng Google
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  //Callback sau khi Google xác thực
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    if (!user) return res.status(400).send('User not found');

    const tokenUser: Omit<TokenPayload, 'lastLogin'> = {
      _id: String(user._id),
      email: user.email,
      name: user.name,
      roleId: String(user.roleId),
      sex: user.sex,
      dayOfBirth: user.dayOfBirth,
    };

    const { accessToken, refreshToken } = await this.authService.getTokens(tokenUser);
    await this.authService.updateRefreshToken(String(user._id), refreshToken);

    const html = `
      <script>
        window.opener.postMessage({
          accessToken: '${accessToken}',
          refreshToken: '${refreshToken}',
          username: '${user.name}',
          email: '${user.email}',
          roleId: '${user.roleId ?? ''}'
        }, 'https://itzenops.vercel.app');
        window.close();
      </script>
    `;
    res.send(html);
  }

  // Đăng nhập bằng tài khoản thường
  @Public()
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.username, body.password);

    const tokenUser: Omit<TokenPayload, 'lastLogin'> = {
      _id: String(user._id),
      email: user.email,
      name: user.name,
      roleId: String(user.roleId),
      sex: user.sex,
      dayOfBirth: user.dayOfBirth,
    };

    const { accessToken, refreshToken } = await this.authService.getTokens(tokenUser);
    await this.authService.updateRefreshToken(String(user._id), refreshToken);

    this.setRefreshTokenCookie(res, refreshToken);

    return {
      message: 'Đăng nhập thành công',
      accessToken,
      user,
    };
  }

  // Làm mới Access Token
  @Public()
  @Post('refresh')
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('Missing Refresh Token');

    try {
      const payload = await this.authService.verifyRefreshToken(refreshToken);
      const userId = payload.userId;

      const storedToken = await this.authService.getStoredRefreshToken(userId);
      if (!storedToken || storedToken !== refreshToken) {
        res.clearCookie('refreshToken');
        throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã bị thu hồi');
      }

      // Lấy lại thông tin user từ DB
      const user = await this.authService.validateUserById(userId);

      const { accessToken, refreshToken: newRefreshToken } = await this.authService.getTokens(user);
      await this.authService.updateRefreshToken(userId, newRefreshToken);

      this.setRefreshTokenCookie(res, newRefreshToken);

      return { accessToken };
    } catch (e) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Refresh Token không hợp lệ');
    }
  }

  // Kiểm tra Access Token
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');
    return {
      authenticated: true,
      user: req.user,
    };
  }

  // Đăng xuất
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');
    const userId = (req.user as any).userId;

    await this.authService.removeRefreshToken(userId);
    res.clearCookie('refreshToken');

    return { success: true, message: 'Đăng xuất thành công' };
  }
}