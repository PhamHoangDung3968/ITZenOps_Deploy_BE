"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const argon2 = __importStar(require("argon2"));
const crypto_1 = require("crypto");
const mailer_1 = require("@nestjs-modules/mailer");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    configService;
    userModel;
    mailerService;
    constructor(configService, userModel, mailerService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_REDIRECT_URI'),
            scope: ['email', 'profile'],
        });
        this.configService = configService;
        this.userModel = userModel;
        this.mailerService = mailerService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { name, emails, id } = profile;
        const email = emails[0].value;
        let user = await this.userModel.findOne({ email });
        const generatedUsername = email.split('@')[0];
        const rawPassword = (0, crypto_1.randomBytes)(8).toString('hex');
        const hashedPassword = await argon2.hash(rawPassword);
        const defaultRoleId = new mongoose_2.Types.ObjectId('690ac8129504cedae7597362');
        const specialRoleId = '690ac7fd9504cedae759735e';
        if (!user) {
            user = new this.userModel({
                name: name.givenName,
                email,
                username: generatedUsername,
                password: hashedPassword,
                provider: 'google',
                googleId: id,
                status: 1,
                lastLogin: new Date(),
                sex: null,
                dayOfBirth: null,
                roleId: defaultRoleId,
                emailSent: false,
            });
            await user.save();
            if (String(defaultRoleId) === specialRoleId) {
                await this.mailerService.sendMail({
                    to: email,
                    subject: 'Thông tin đăng nhập ITZenOps',
                    text: `Xin chào ${name.givenName},\n\nTài khoản của bạn đã được tạo:\n\nUsername: ${generatedUsername}\nMật khẩu: ${rawPassword}\n\nBạn có thể đăng nhập tại: https://itzenops.com/login\n\nTrân trọng,\nITZenOps Team`,
                });
                user.emailSent = true;
                await user.save();
            }
        }
        else {
            user.lastLogin = new Date();
            if (String(user.roleId) === specialRoleId &&
                user.emailSent !== true) {
                await this.mailerService.sendMail({
                    to: email,
                    subject: 'Thông tin đăng nhập ITZenOps',
                    text: `Xin chào ${user.name},\n\nTài khoản của bạn đã được cập nhật:\n\nUsername: ${user.username}\nMật khẩu: ${rawPassword}\n\nBạn có thể đăng nhập tại: https://itzenops.com/login\n\nTrân trọng,\nITZenOps Team`,
                });
                user.password = hashedPassword;
                user.emailSent = true;
            }
            await user.save();
        }
        done(null, user);
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        mailer_1.MailerService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map