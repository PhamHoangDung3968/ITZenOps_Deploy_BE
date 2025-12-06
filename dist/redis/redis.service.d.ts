import Redis from 'ioredis';
export declare class RedisService {
    private readonly client;
    constructor();
    getClient(): Redis;
    set(key: string, value: string, ttl?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
}
