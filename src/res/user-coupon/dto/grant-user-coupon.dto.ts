// src/user-coupon/dto/grant-user-coupon.dto.ts
import { IsString } from 'class-validator';

export class GrantUserCouponDto {
  @IsString()
  userId: string;

  @IsString()
  couponId: string; // 발급할 쿠폰 ID
}
