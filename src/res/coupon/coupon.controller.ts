// src/coupon/coupon.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly service: CouponService) {}

  // 목록: 배열 그대로 반환 (프론트 store pickList 호환)
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // 생성: { error, message, data }
  @Post()
  async create(@Body() dto: CreateCouponDto) {
    const data = await this.service.create(dto);
    return { error: 0, message: '', data };
  }

  // 수정: { error, message, data }
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    const data = await this.service.update(id, dto);
    return { error: 0, message: '', data };
  }

  // 삭제: { error, message }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { error: 0, message: '' };
  }
}
