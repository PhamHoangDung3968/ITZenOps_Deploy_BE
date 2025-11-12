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
const session_store_1 = require("./session.store");
const session_guard_1 = require("./session.guard");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async googleAuth() { }
    async googleAuthRedirect(req, res) {
        const user = req.user;
        if (!user)
            return res.status(400).send('User not found');
        const sessionId = (0, session_store_1.createSession)({
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
        }, 'http://localhost:3001');
        window.close();
      </script>
    `;
        res.send(html);
    }
    async login(body) {
        const user = await this.authService.validateUser(body.username, body.password);
        const sessionId = (0, session_store_1.createSession)({
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
    verify(req) {
        return {
            authenticated: true,
            user: req.user,
        };
    }
    logout(sessionId) {
        (0, session_store_1.deleteSession)(sessionId);
        return { success: true };
    }
};
exports.AuthController = AuthController;
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
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('verify'),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map