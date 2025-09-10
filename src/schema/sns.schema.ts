import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SnsDocument = HydratedDocument<Sns>;

@Schema({ collection: 'sns' })
export class Sns {
  // @Prop()
  // _id: string;
  @Prop()
  userId: string;
  @Prop()
  snsEmail: string;
  @Prop()
  type: string;
}

export const SnsSchema = SchemaFactory.createForClass(Sns);
