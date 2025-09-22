// src/user-coupon/user-coupon.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Coupon, CouponDocument } from 'src/schema/coupon.schema';
import { UserCoupon, UserCouponDocument } from 'src/schema/user-coupon.schema';
import { GrantUserCouponDto } from './dto/grant-user-coupon.dto';

type ViewType = 'usable' | 'expired' | 'all';

@Injectable()
export class UserCouponService {
  constructor(
    @InjectModel(UserCoupon.name)
    private readonly userCouponModel: Model<UserCouponDocument>,
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}
  private addDaysUTC(date: Date, days: number) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  private addMonthsUTC(date: Date, months: number) {
    const d = new Date(date.getTime());
    d.setUTCMonth(d.getUTCMonth() + months);
    return d;
  }

  /** 사용자에게 쿠폰 발급 */
  async grant(dto: GrantUserCouponDto) {
    const coupon = await this.couponModel.findById(dto.couponId).lean().exec();
    if (!coupon) throw new NotFoundException('쿠폰을 찾을 수 없습니다.');

    const grantedAt = new Date();
    const expiresAt = this.addDaysUTC(grantedAt, Number(coupon.validDays ?? 0));

    const doc = await this.userCouponModel.create({
      userId: dto.userId,
      couponId: String(coupon._id),
      name: coupon.name,
      type: coupon.type,
      validDays: coupon.validDays,
      grantedAt,
      expiresAt,
      status: 0, // 미사용
    });

    return doc.toObject();
  }

  /** 특정 사용자 보유 쿠폰 목록 */
  async listByUser(userId: string, status?: number) {
    const q: any = { userId };
    if (status === 0 || status === 1) q.status = status;
    return this.userCouponModel
      .find(q)
      .sort({ status: 1, expiresAt: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  /** 쿠폰 사용 처리 */
  async use(id: string) {
    const now = new Date();
    const doc = await this.userCouponModel.findById(id).exec();
    if (!doc) throw new NotFoundException('보유 쿠폰을 찾을 수 없습니다.');

    if (doc.status === 1) {
      throw new BadRequestException('이미 사용된 쿠폰입니다.');
    }
    if (doc.expiresAt < now) {
      throw new BadRequestException('만료된 쿠폰입니다.');
    }

    doc.status = 1;
    doc.usedAt = now;
    await doc.save();

    return doc.toObject();
  }

  async useCancel(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid_user_coupon_id'); // 400
    }

    const updated = await this.userCouponModel
      .findOneAndUpdate(
        { _id: id, status: { $ne: -1 } }, // 중복 취소 방지
        {
          $set: {
            status: -1,
          },
        },
        { new: true },
      )
      .lean()
      .exec();
    if (!updated) {
      throw new BadRequestException('useCoupon_cancel_failed');
    }
    return updated;
  }

  /** (옵션) 단건 조회 */
  async findOne(id: string) {
    const doc = await this.userCouponModel.findById(id).lean().exec();
    if (!doc) throw new NotFoundException('보유 쿠폰을 찾을 수 없습니다.');
    return doc;
  }

  async listByUserWithFilter(
    userId: string,
    view: ViewType = 'usable',
    months = 1,
  ) {
    const now = new Date();
    const q: any = { userId };
    let sort: Record<string, 1 | -1> = {
      status: 1,
      expiresAt: 1,
      createdAt: -1,
    };

    if (view === 'usable') {
      q.status = 0;
      q.expiresAt = { $gte: now, $lte: this.addMonthsUTC(now, months) };
      sort = { expiresAt: 1, createdAt: -1 };
    } else if (view === 'expired') {
      q.status = 0;
      q.expiresAt = { $lt: now, $gte: this.addMonthsUTC(now, -months) };
      sort = { expiresAt: -1, createdAt: -1 };
    } else {
      // 'all' : 기간/상태 제한 없음(필요시 클라에서 탭 필터)
      sort = { status: 1, expiresAt: 1, createdAt: -1 };
    }

    return this.userCouponModel.find(q).sort(sort).lean().exec();
  }
}
