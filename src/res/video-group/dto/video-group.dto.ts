import { IsString, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVideoGroupDto {
  // @IsString()
  // _id: string;

  @IsString()
  group: string;

  @IsString()
  season: string;
}
