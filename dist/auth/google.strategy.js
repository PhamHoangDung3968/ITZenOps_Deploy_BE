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
exports.GoogleStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/user.schema");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    configService;
    userModel;
    roleModel;
    constructor(configService, userModel, roleModel) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_REDIRECT_URI'),
            scope: ['email', 'profile'],
        });
        this.configService = configService;
        this.userModel = userModel;
        this.roleModel = roleModel;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { name, emails, id } = profile;
        const email = emails[0].value;
        let user = await this.userModel.findOne({ email });
        if (!user) {
            user = new this.userModel({
                name: name.givenName,
                email,
                dayOfBirth: null,
                provider: 'google',
                googleId: id,
                status: 1,
                lastLogin: new Date(),
                sex: null,
                roleId: '690ac8129504cedae7597362',
            });
            await user.save();
        }
        else {
            const hasAllFields = user.status !== undefined &&
                user.lastLogin !== undefined &&
                user.sex !== undefined &&
                user.roleId !== undefined &&
                user.dayOfBirth !== undefined;
            if (!hasAllFields) {
                user.status ??= 1;
                user.lastLogin ??= new Date();
                user.sex ??= null;
                user.roleId ??= new mongoose_2.Types.ObjectId('690ac8129504cedae7597362');
                user.dayOfBirth ??= null;
                await user.save();
            }
        }
        done(null, user);
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)('Role')),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map