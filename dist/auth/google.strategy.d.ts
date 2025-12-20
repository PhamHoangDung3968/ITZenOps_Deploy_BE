import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserDocument } from '../users/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
declare const GoogleStrategy_base: new (...args: [options: import("passport-google-oauth20").StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    private configService;
    private userModel;
    private mailerService;
    constructor(configService: ConfigService, userModel: Model<UserDocument>, mailerService: MailerService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
