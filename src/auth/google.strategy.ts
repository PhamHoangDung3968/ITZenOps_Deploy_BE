import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailerService: MailerService,
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

    const generatedUsername = email.split('@')[0];
    const rawPassword = randomBytes(8).toString('hex');
    const hashedPassword = await argon2.hash(rawPassword);

    const defaultRoleId = new Types.ObjectId('690ac8129504cedae7597362');
    const specialRoleId = '690ac7fd9504cedae759735e';

    if (!user) {
      user = new this.userModel({
        name: name.givenName,
        email,
        username: generatedUsername,
        password: hashedPassword,
        provider: 'google',
        googleId: id,
        status: 1,
        lastLogin: new Date(),
        sex: null,
        dayOfBirth: null,
        roleId: defaultRoleId,
        emailSent: false,
      });

      await user.save();

      // Nếu role mặc định trùng với role đặc biệt thì gửi email ngay
      if (String(defaultRoleId) === specialRoleId) {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Thông tin đăng nhập ITZenOps',
          text: `Xin chào ${name.givenName},\n\nTài khoản của bạn đã được tạo:\n\nUsername: ${generatedUsername}\nMật khẩu: ${rawPassword}\n\nBạn có thể đăng nhập tại: https://itzenops.com/login\n\nTrân trọng,\nITZenOps Team`,
        });

        user.emailSent = true;
        await user.save();
      }
    } else {
      user.lastLogin = new Date();

      // Nếu role đã bị đổi sang role đặc biệt và chưa gửi email
      if (
        String(user.roleId) === specialRoleId &&
        user.emailSent !== true
      ) {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Thông tin đăng nhập ITZenOps',
          text: `Xin chào ${user.name},\n\nTài khoản của bạn đã được cập nhật:\n\nUsername: ${user.username}\nMật khẩu: ${rawPassword}\n\nBạn có thể đăng nhập tại: https://itzenops.com/login\n\nTrân trọng,\nITZenOps Team`,
        });

        user.password = hashedPassword;
        user.emailSent = true;
      }

      await user.save();
    }

    done(null, user);
  }
}