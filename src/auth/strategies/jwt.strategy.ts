import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) throw new UnauthorizedException('Token không tồn tại');

    if (await this.authService.isAccessTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token đã bị thu hồi');
    }

    if (!(await this.authService.isAccessTokenWhitelisted(token))) {
      throw new UnauthorizedException('Token không nằm trong whitelist');
    }

    return {
      userId: payload._id,
      email: payload.email,
      name: payload.name,
      roleId: payload.roleId,
      sex: payload.sex,
      dayOfBirth: payload.dayOfBirth,
    };
  }
}