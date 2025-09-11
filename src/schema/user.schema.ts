import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user' })
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  birth: string;

  // @Prop()
  // gender: string;

  @Prop()
  isDel: string;

  @Prop()
  regDate: string;

  @Prop()
  type: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
