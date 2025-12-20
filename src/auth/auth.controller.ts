import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import type { Request } from 'express';
import { AuthService, TokenPayload } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Đăng nhập thường
  @Public()
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user: TokenPayload = await this.authService.validateUser(body.username, body.password);

    const { accessToken, refreshToken } = await this.authService.getTokens(user);
    await this.authService.updateRefreshToken(user._id, refreshToken);
    await this.authService.whitelistAccessToken(accessToken);

    return {
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      user, // chỉ chứa payload an toàn, không có password
    };
  }

  // Đăng nhập Google
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport sẽ tự redirect sang Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as TokenPayload;
    const { accessToken, refreshToken } = await this.authService.getTokens(user);
    await this.authService.updateRefreshToken(user._id, refreshToken);
    await this.authService.whitelistAccessToken(accessToken);

    // Trả token về cho frontend qua postMessage
    const payload = { accessToken, refreshToken, username: user.name || user.email };
    res.send(`
      <script>
        window.opener && window.opener.postMessage(${JSON.stringify(payload)}, '*');
        window.close();
      </script>
    `);
  }

  // Làm mới Access Token
  @Public()
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) throw new UnauthorizedException('Missing Refresh Token');

    const payload = await this.authService.verifyRefreshToken(body.refreshToken);
    const userId = payload.userId;

    const storedToken = await this.authService.getStoredRefreshToken(userId);
    if (!storedToken || storedToken !== body.refreshToken) {
      throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã bị thu hồi');
    }

    const user = await this.authService.validateUserById(userId);
    const { accessToken, refreshToken: newRefreshToken } = await this.authService.getTokens(user);
    await this.authService.updateRefreshToken(userId, newRefreshToken);
    await this.authService.whitelistAccessToken(accessToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  // Kiểm tra Access Token
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');
    return { authenticated: true, user: req.user };
  }

  // Đăng xuất
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('User not authenticated');
    const userId = (req.user as TokenPayload)._id;

    await this.authService.removeRefreshToken(userId);

    const accessToken = req.headers.authorization?.split(' ')[1];
    if (accessToken) await this.authService.blacklistAccessToken(accessToken);

    return { success: true, message: 'Đăng xuất thành công' };
  }
}