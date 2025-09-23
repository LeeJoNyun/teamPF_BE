import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePetDto {
  @IsMongoId()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional() @IsString() birthYear?: string;
  @IsOptional() @IsString() birthMonth?: string;
  @IsOptional() @IsString() age?: string; // 미입력 시 스키마 기본값

  @IsOptional() @IsString() vaccinations?: string;
  @IsOptional() @IsString() parasites?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() breed?: string;
  @IsOptional() @IsString() weight?: string;
  @IsOptional() @IsString() neutered?: string;
  @IsOptional() @IsString() hospital?: string;
  @IsOptional() @IsString() healthNote?: string;
  @IsOptional() @IsString() moreNote?: string;
}

export class UpdatePetDto extends PartialType(CreatePetDto) {}
