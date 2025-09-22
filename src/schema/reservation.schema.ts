// schemas/reservation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReservationDocument = HydratedDocument<Reservation>;

export enum ResType {
  HOTEL = 'hotel',
  GROOMING = 'grooming',
}

@Schema({ collection: 'reservation' })
export class Reservation {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: ResType })
  resType: ResType;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, type: Date }) regDate: Date;
  @Prop({ required: true, type: Date }) startDate: Date;
  @Prop({ required: true, type: Date }) endDate: Date;

  @Prop()
  lateCheckOutTime?: string;

  @Prop()
  beautyTime?: string;

  @Prop()
  size?: string;

  @Prop()
  beautyType?: string;

  @Prop()
  beautyOption?: string;

  @Prop({ required: true })
  totalPrice: number;

  @Prop()
  couponId?: string;

  @Prop()
  request?: string;

  @Prop({ required: true, enum: [-1, 1] })
  status: number;

  @Prop({ type: Date })
  canceledAt?: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
