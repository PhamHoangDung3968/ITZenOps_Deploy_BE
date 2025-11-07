import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../roles/roles.schema'; // đường dẫn đúng tới Role

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, required: false })
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

  // 👇 Thêm roleId dạng ObjectId, liên kết với Role
  @Prop({ type: Types.ObjectId, ref: 'Role', required: false })
  roleId: Role | Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);