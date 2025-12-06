"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const public_decorator_1 = require("./decorators/public.decorator");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    authService;
    configService;
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    setRefreshTokenCookie(res, refreshToken) {
        const secure = this.configService.get('NODE_ENV') === 'production';
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure,
            sameSite: 'strict',
            path: '/',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
    }
    async googleAuth() { }
    async googleAuthRedirect(req, res) {
        const user = req.user;
        if (!user)
            return res.status(400).send('User not found');
        const tokenUser = {
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
        }, 'http://localhost:3001');
        window.close();
      </script>
    `;
        res.send(html);
    }
    async login(body, res) {
        const user = await this.authService.validateUser(body.username, body.password);
        const tokenUser = {
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
    async refreshTokens(req, res) {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken)
            throw new common_1.UnauthorizedException('Missing Refresh Token');
        try {
            const payload = await this.authService.verifyRefreshToken(refreshToken);
            const userId = payload.userId;
            const storedToken = await this.authService.getStoredRefreshToken(userId);
            if (!storedToken || storedToken !== refreshToken) {
                res.clearCookie('refreshToken');
                throw new common_1.UnauthorizedException('Refresh Token không hợp lệ hoặc đã bị thu hồi');
            }
            const user = await this.authService.validateUserById(userId);
            const { accessToken, refreshToken: newRefreshToken } = await this.authService.getTokens(user);
            await this.authService.updateRefreshToken(userId, newRefreshToken);
            this.setRefreshTokenCookie(res, newRefreshToken);
            return { accessToken };
        }
        catch (e) {
            res.clearCookie('refreshToken');
            throw new common_1.UnauthorizedException('Refresh Token không hợp lệ');
        }
    }
    verify(req) {
        if (!req.user)
            throw new common_1.UnauthorizedException('User not authenticated');
        return {
            authenticated: true,
            user: req.user,
        };
    }
    async logout(req, res) {
        if (!req.user)
            throw new common_1.UnauthorizedException('User not authenticated');
        const userId = req.user.userId;
        await this.authService.removeRefreshToken(userId);
        res.clearCookie('refreshToken');
        return { success: true, message: 'Đăng xuất thành công' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map