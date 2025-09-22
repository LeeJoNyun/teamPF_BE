// src/coupon/coupon.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from 'src/schema/coupon.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}

  async create(dto: CreateCouponDto) {
    const doc = await this.couponModel.create(dto);
    return doc.toObject();
  }

  async findAll() {
    // 최신순
    const list = await this.couponModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return list;
  }

  async findOne(id: string) {
    const doc = await this.couponModel.findById(id).lean().exec();
    if (!doc) throw new NotFoundException('쿠폰을 찾을 수 없습니다.');
    return doc;
  }

  async update(id: string, dto: UpdateCouponDto) {
    const doc = await this.couponModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .lean()
      .exec();
    if (!doc) throw new NotFoundException('쿠폰을 찾을 수 없습니다.');
    return doc;
  }

  async remove(id: string) {
    const ret = await this.couponModel.findByIdAndDelete(id).lean().exec();
    if (!ret) throw new NotFoundException('쿠폰을 찾을 수 없습니다.');
    return true;
  }
}
