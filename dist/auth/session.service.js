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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const uuid_1 = require("uuid");
let SessionService = class SessionService {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async createSession(user, ttl = 7 * 24 * 60 * 60) {
        const sessionId = (0, uuid_1.v4)();
        await this.redis.set(`session:${sessionId}`, JSON.stringify(user), 'EX', ttl);
        return sessionId;
    }
    async getSession(sessionId) {
        const data = await this.redis.get(`session:${sessionId}`);
        return data ? JSON.parse(data) : null;
    }
    async deleteSession(sessionId) {
        await this.redis.del(`session:${sessionId}`);
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [ioredis_1.default])
], SessionService);
//# sourceMappingURL=session.service.js.map