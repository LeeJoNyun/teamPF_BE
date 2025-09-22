// src/user-coupon/user-coupon.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCoupon, UserCouponSchema } from 'src/schema/user-coupon.schema';
import { Coupon, CouponSchema } from 'src/schema/coupon.schema';
import { UserCouponService } from './user-coupon.service';
import { UserCouponController } from './user-coupon.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCoupon.name, schema: UserCouponSchema },
      { name: Coupon.name, schema: CouponSchema }, // 발급 시 원본 쿠폰 조회용
    ]),
  ],
  controllers: [UserCouponController],
  providers: [UserCouponService],
  exports: [UserCouponService],
})
export class UserCouponModule {}
