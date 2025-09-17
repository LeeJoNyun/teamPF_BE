import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ collection: 'admin' })
export class Admin {
  // @Prop()
  // _id: string;
  @Prop()
  id: string;
  @Prop()
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
