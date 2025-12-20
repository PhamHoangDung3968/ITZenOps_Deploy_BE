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
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const public_decorator_1 = require("./decorators/public.decorator");
const passport_1 = require("@nestjs/passport");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(body) {
        const user = await this.authService.validateUser(body.username, body.password);
        const { accessToken, refreshToken } = await this.authService.getTokens(user);
        await this.authService.updateRefreshToken(user._id, refreshToken);
        await this.authService.whitelistAccessToken(accessToken);
        return {
            message: 'Đăng nhập thành công',
            accessToken,
            refreshToken,
            user,
        };
    }
    async googleAuth() {
    }
    async googleCallback(req, res) {
        const user = req.user;
        const { accessToken, refreshToken } = await this.authService.getTokens(user);
        await this.authService.updateRefreshToken(user._id, refreshToken);
        await this.authService.whitelistAccessToken(accessToken);
        const payload = { accessToken, refreshToken, username: user.name || user.email };
        res.send(`
      <script>
        window.opener && window.opener.postMessage(${JSON.stringify(payload)}, '*');
        window.close();
      </script>
    `);
    }
    async refresh(body) {
        if (!body.refreshToken)
            throw new common_1.UnauthorizedException('Missing Refresh Token');
        const payload = await this.authService.verifyRefreshToken(body.refreshToken);
        const userId = payload.userId;
        const storedToken = await this.authService.getStoredRefreshToken(userId);
        if (!storedToken || storedToken !== body.refreshToken) {
            throw new common_1.UnauthorizedException('Refresh Token không hợp lệ hoặc đã bị thu hồi');
        }
        const user = await this.authService.validateUserById(userId);
        const { accessToken, refreshToken: newRefreshToken } = await this.authService.getTokens(user);
        await this.authService.updateRefreshToken(userId, newRefreshToken);
        await this.authService.whitelistAccessToken(accessToken);
        return { accessToken, refreshToken: newRefreshToken };
    }
    verify(req) {
        if (!req.user)
            throw new common_1.UnauthorizedException('User not authenticated');
        return { authenticated: true, user: req.user };
    }
    async logout(req) {
        if (!req.user)
            throw new common_1.UnauthorizedException('User not authenticated');
        const userId = req.user._id;
        await this.authService.removeRefreshToken(userId);
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (accessToken)
            await this.authService.blacklistAccessToken(accessToken);
        return { success: true, message: 'Đăng xuất thành công' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map