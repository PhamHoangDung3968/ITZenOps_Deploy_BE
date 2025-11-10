import { Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserDocument } from '../users/user.schema';
import { RoleDocument } from '../roles/roles.schema';
declare const GoogleStrategy_base: new (...args: [options: import("passport-google-oauth20").StrategyOptionsWithRequest] | [options: StrategyOptions] | [options: StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    private configService;
    private userModel;
    private roleModel;
    constructor(configService: ConfigService, userModel: Model<UserDocument>, roleModel: Model<RoleDocument>);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
export {};
