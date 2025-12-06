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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStore = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../redis/redis.service");
const uuid_1 = require("uuid");
let SessionStore = class SessionStore {
    redisService;
    redis;
    SESSION_TTL = 60 * 60 * 4;
    constructor(redisService) {
        this.redisService = redisService;
        this.redis = this.redisService.getClient();
    }
    async createSession(user) {
        const sessionId = (0, uuid_1.v4)();
        await this.redis.set(`session:${sessionId}`, JSON.stringify(user), 'EX', this.SESSION_TTL);
        return sessionId;
    }
    async getSession(sessionId) {
        const result = await this.redis.get(`session:${sessionId}`);
        return result ? JSON.parse(result) : null;
    }
    async deleteSession(sessionId) {
        await this.redis.del(`session:${sessionId}`);
    }
};
exports.SessionStore = SessionStore;
exports.SessionStore = SessionStore = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _a : Object])
], SessionStore);
//# sourceMappingURL=session.store.js.map