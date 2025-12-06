import Redis from 'ioredis';
export declare class SessionService {
    private readonly redis;
    constructor(redis: Redis);
    createSession(user: any, ttl?: number): Promise<string>;
    getSession(sessionId: string): Promise<any>;
    deleteSession(sessionId: string): Promise<void>;
}
