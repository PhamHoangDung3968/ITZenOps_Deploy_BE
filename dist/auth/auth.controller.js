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
const create_admin_dto_1 = require("../admins/dto/create-admin.dto");
const passport_1 = require("@nestjs/passport");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(dto, req, res) {
        const admin = await this.authService.validateAdmin(dto.username, dto.password);
        req.session.admin = {
            id: admin._id.toString(),
            username: admin.username,
            role: 'admin',
        };
        return res.json({ message: 'Đăng nhập admin thành công' });
    }
    async verify(req) {
        if (req.session.admin) {
            return { type: 'admin', user: req.session.admin };
        }
        if (req.session.user) {
            return { type: 'user', user: req.session.user };
        }
        throw new common_1.UnauthorizedException('Chưa đăng nhập');
    }
    logout(req, res) {
        req.session.destroy(() => { });
        res.clearCookie('connect.sid');
        return res.json({ message: 'Đã đăng xuất' });
    }
    async googleAuth() {
    }
    async googleAuthRedirect(req, res) {
        const user = req.user;
        req.session.user = {
            id: user._id.toString(),
            email: user.email,
            username: user.name,
            roleId: user.roleId?.toString() ?? '',
            sex: user.sex ?? '',
            dayOfBirth: user.dayOfBirth?.toString() ?? '',
            lastLogin: user.lastLogin?.toString() ?? '',
        };
        const html = `
      <script>
        window.opener.postMessage({
          message: 'Đăng nhập Google thành công!',
          username: '${user.name}',
          email: '${user.email}',
          roleId: '${user.roleId ?? ''}'
        }, 'http://localhost:3001');
        window.close();
      </script>
    `;
        res.send(html);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
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
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map