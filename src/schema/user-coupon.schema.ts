// src/schema/user-coupon.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CouponType } from './coupon.schema'; // 기존 쿠폰 스키마의 enum 재사용

export type UserCouponDocument = HydratedDocument<UserCoupon>;

@Schema({ collection: 'user_coupon' })
export class UserCoupon {
  @Prop({ required: true }) userId: string;

  @Prop({ required: true, type: String }) couponId: string;

  // ── 스냅샷(발급 시점 쿠폰 정보)
  @Prop({ required: true }) name: string;
  @Prop({ required: true, enum: CouponType, type: String }) type: CouponType; // 'pass' | 'discount'
  @Prop({ required: true, type: Number, min: 1 }) validDays: number;
  @Prop() desc?: string;

  // ── 메타
  @Prop({ required: true, type: Date }) grantedAt: Date;
  @Prop({ required: true, type: Date }) expiresAt: Date;

  // 0: 미사용, 1: 사용
  @Prop({ required: true, type: Number, enum: [0, 1], default: 0 })
  status: number;

  @Prop({ type: Date }) usedAt?: Date;
}

export const UserCouponSchema = SchemaFactory.createForClass(UserCoupon);

// 조회 최적화 인덱스
UserCouponSchema.index({ userId: 1, status: 1, expiresAt: -1 });
UserCouponSchema.index({ couponId: 1 });
