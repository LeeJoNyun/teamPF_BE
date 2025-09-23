import {
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateReplyDto {
  @IsString() userId: string;
  @IsString() videoId: string;

  @IsString()
  @MaxLength(2000)
  text: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  star?: number;
}
