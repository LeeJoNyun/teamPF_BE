import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PetDocument = HydratedDocument<Pet>;

@Schema({ collection: 'pets', timestamps: true })
export class Pet {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, default: '', trim: true }) birthYear: string;
  @Prop({ type: String, default: '', trim: true }) birthMonth: string;
  @Prop({ type: String, default: '미입력', trim: true }) age: string;

  @Prop({ type: String, default: '', trim: true }) profileImage: string;

  @Prop({ type: [String], default: [] }) vaccinations: string[]; // ← 배열로
  @Prop({ type: [String], default: [] }) parasites: string[]; // ← 배열로
  @Prop({ type: String, default: '', trim: true }) gender: string;
  @Prop({ type: String, default: '', trim: true }) breed: string;
  @Prop({ type: String, default: '', trim: true }) weight: string;
  @Prop({ type: String, default: '', trim: true }) neutered: string;
  @Prop({ type: String, default: '', trim: true }) hospital: string;
  @Prop({ type: String, default: '', trim: true }) healthNote: string;
  @Prop({ type: String, default: '', trim: true }) moreNote: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
