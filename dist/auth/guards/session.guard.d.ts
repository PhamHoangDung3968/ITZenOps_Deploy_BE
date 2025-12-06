import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SessionStore } from './session.store';
export declare class SessionGuard implements CanActivate {
    private sessionStore;
    constructor(sessionStore: SessionStore);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
