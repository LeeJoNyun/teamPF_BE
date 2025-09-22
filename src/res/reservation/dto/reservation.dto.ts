import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ResType {
  HOTEL = 'hotel',
  GROOMING = 'grooming',
}

const EmptyToUndefined = () =>
  Transform(({ value }) => (value === '' ? undefined : value));

export class ReservationDto {
  @IsString()
  userId: string;

  @IsEnum(ResType)
  resType: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsDateString() // 예약일
  regDate: string;

  @IsDateString() // 입실 일자
  startDate: string;

  @IsDateString() // 퇴실 일자(미용은 입실일과 동일하게 입력)
  endDate: string;

  @IsOptional()
  @IsString() // 퇴실연장시간
  lateCheckOutTime?: string;

  @IsOptional()
  @IsString() // 미용 예약 시간
  beautyTime?: string;

  @IsString() //개 크기
  size: string;

  @IsOptional()
  @IsString() //미용 타입
  beautyType?: string;

  @IsOptional()
  @IsString() // 미용 추가 항목
  beautyOption?: string;

  @IsInt() // 결제금액
  totalPrice: number;

  @IsOptional()
  @IsString()
  couponId?: string;

  @IsString() //요청사항
  request: string;
}
