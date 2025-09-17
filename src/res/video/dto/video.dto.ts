import { IsString, IsArray, ValidateNested, IsInt, IsOptional, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';


export class CreateVideoDto {
  @IsString()
  koTitle: string;

  @IsString()
  enTitle: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  year?: number;

  // 관람 제한: ALL / 12 / 15 / 19
  @IsOptional()
  @IsIn(['ALL', '12', '15', '19'])
  limit?: string;

  @IsOptional()
  @IsString()
  category?: string;

  // 러닝타임(분)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  runtime?: number;

  @IsString()
  youtubeId: string;

  @IsOptional()
  @IsString()
  desc?: string;
}

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}