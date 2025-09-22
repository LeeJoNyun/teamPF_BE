// src/user-coupon/user-coupon.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { UserCouponService } from './user-coupon.service';
import { GrantUserCouponDto } from './dto/grant-user-coupon.dto';

@Controller('user-coupons')
export class UserCouponController {
  constructor(private readonly service: UserCouponService) {}

  // 발급
  @Post()
  async grant(@Body() dto: GrantUserCouponDto) {
    const data = await this.service.grant(dto);
    return { error: 0, message: '', data };
  }

  // 사용자 보유 목록
  @Get('user/:userId')
  async listByUser(
    @Param('userId') userId: string,
    @Query('status') status?: string,
  ) {
    const s = status != null ? Number(status) : undefined; // '0' | '1' → number
    const data = await this.service.listByUser(userId, s);
    return data; // 리스트는 배열 그대로
  }

  // 사용 처리
  @Patch(':id/use')
  async use(@Param('id') id: string) {
    const data = await this.service.use(id);
    return { error: 0, message: '', data };
  }
  // 사용 취소 처리
  @Patch(':id/cancel')
  async useCancel(@Param('id') id: string) {
    const data = await this.service.useCancel(id);
    return { error: 0, message: '', data };
  }

  // (옵션) 단건 조회
  @Get(':id')
  async one(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return data;
  }
}
