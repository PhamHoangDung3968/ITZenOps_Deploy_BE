import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: Date, required: false })
  dayOfBirth: Date | null;

  @Prop()
  provider: string;

  @Prop()
  googleId: string;

  @Prop()
  status: number;

  @Prop()
  lastLogin: Date;

  @Prop({ type: String, required: false })
  sex: string | null;

  // ✅ Giữ kiểu ObjectId, không cần Role nếu không populate
  @Prop({ type: Types.ObjectId, ref: 'Role', required: false })
  roleId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);