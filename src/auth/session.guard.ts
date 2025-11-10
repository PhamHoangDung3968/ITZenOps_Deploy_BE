import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    const isLoggedIn = req.session?.user || req.session?.admin;

    if (!isLoggedIn) {
      throw new UnauthorizedException('Bạn chưa đăng nhập');
    }

    return true;
  }
}