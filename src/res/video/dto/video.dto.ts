import { IsString, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class VideoItemDto {
  @IsInt()
  no: number;

  @IsString()
  title: string;

  @IsString()
  youtubeId: string;
}

export class CreateVideoDto {
  @IsString()
  group: string;

  // @IsString()
  // groupId: string;

  @IsString()
  season: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoItemDto)
  videos: VideoItemDto[];
}
