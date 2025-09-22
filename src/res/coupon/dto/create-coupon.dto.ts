import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CouponType } from 'src/schema/coupon.schema';

export class CreateCouponDto {
  @IsString()
  name: string;

  @IsEnum(CouponType)
  type: CouponType; // 'pass' | 'discount'

  @Type(() => Number)
  @IsInt()
  @Min(1)
  validDays: number;

  @IsOptional()
  @IsString()
  desc?: string;
}
