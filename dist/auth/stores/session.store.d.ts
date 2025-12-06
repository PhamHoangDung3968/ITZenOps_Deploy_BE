import { RedisService } from '../redis/redis.service';
export declare class SessionStore {
    private redisService;
    private redis;
    private readonly SESSION_TTL;
    constructor(redisService: RedisService);
    createSession(user: any): Promise<string>;
    getSession(sessionId: string): Promise<any | null>;
    deleteSession(sessionId: string): Promise<void>;
}
