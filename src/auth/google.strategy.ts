import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { Role, RoleDocument } from '../roles/roles.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('Role') private roleModel: Model<RoleDocument>,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI')!,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, id } = profile;
    const email = emails[0].value;

    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        name: name.givenName,
        email,
        dayOfBirth: null,
        provider: 'google',
        googleId: id,
        status: 1,
        lastLogin: new Date(),
        sex: null,
        roleId: '690ac8129504cedae7597362',
      });

      await user.save();
    } else {
      // Kiểm tra nếu thiếu bất kỳ trường nào thì không cập nhật
      const hasAllFields =
        user.status !== undefined &&
        user.lastLogin !== undefined &&
        user.sex !== undefined &&
        user.roleId !== undefined &&
        user.dayOfBirth !== undefined;

      if (!hasAllFields) {
        user.status ??= 1;
        user.lastLogin ??= new Date();
        user.sex ??= null;
        user.roleId ??= new Types.ObjectId('690ac8129504cedae7597362');
        user.dayOfBirth ??= null;
        await user.save();
      }
    }

    done(null, user);
  }
}