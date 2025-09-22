import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

export enum CouponType {
  PASS = 'pass', // 이용권
  DISCOUNT = 'discount', // 할인권
}

@Schema({ collection: 'coupon' })
export class Coupon {
  @Prop({ required: true })
  name: string; // 쿠폰명

  @Prop({ required: true, enum: CouponType, type: String })
  type: CouponType; // 'pass' 이용권 | 'discount' 할인권

  @Prop({ required: true, type: Number, min: 1 })
  validDays: number; // 사용 가능일수(>=1)
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

// 검색 및 정렬 인덱스(선택)
CouponSchema.index({ name: 1 });
CouponSchema.index({ createdAt: -1 });
