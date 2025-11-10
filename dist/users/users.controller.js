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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const session_guard_1 = require("../auth/session.guard");
const mongoose_1 = require("mongoose");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getUserById(id) {
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('ID không hợp lệ');
        }
        return this.usersService.findUserById(id);
    }
    async updateUserById(id, dto, req) {
        const { roleId, ...safeDto } = dto;
        const updatedUser = await this.usersService.update(id, safeDto);
        if (req.session.user?.id === id) {
            req.session.user = {
                ...req.session.user,
                username: safeDto.name ?? req.session.user.username,
                email: req.session.user.email,
                sex: typeof safeDto.sex === 'string' ? safeDto.sex : req.session.user.sex,
                dayOfBirth: typeof safeDto.dayOfBirth === 'string' ? safeDto.dayOfBirth : req.session.user.dayOfBirth,
                lastLogin: req.session.user.lastLogin,
                roleId: req.session.user.roleId,
            };
        }
        return updatedUser;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(session_guard_1.SessionGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserById", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map