import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { getSession } from './session.store';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['x-session-id'];

    if (!sessionId) {
      throw new UnauthorizedException('Missing session ID');
    }

    const session = getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    request.user = session.user;
    return true;
  }
}