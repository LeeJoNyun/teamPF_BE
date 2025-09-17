// src/video/dto/create-video.dto.ts
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min, IsEnum, Max } from 'class-validator';

export enum Limit {
  ALL = 'ALL',
  TEEN = 'TEEN',
  ADULT = 'ADULT',
}

export enum Category {
  모험 = '모험',
  가족 = '가족',
  드라마 = '드라마',
  코미디 = '코미디',
  기타 = '기타',
  모험ㆍ성장 = '모험ㆍ성장'
}

export class CreateVideoDto {
  @IsString()
  koTitle: string;

  @IsString()
  enTitle: string;

  @Type(() => Number)     // 🔵 문자열을 number로 변환
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @IsString()             // 또는 @IsEnum(Limit)
  limit: string;

  @IsString()             // 또는 @IsEnum(Category)
  category: string;

  @Type(() => Number)     // 🔵 변환
  @IsInt()
  @Min(1)
  runtime: number;

  @IsString()
  youtubeId: string;

  @IsOptional()
  @IsString()
  desc?: string;
}