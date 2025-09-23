// dto/reply.dto.ts
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReplyDto {
  @IsMongoId() userId: string;
  @IsMongoId() videoId: string;
  @IsString() text: string;
  @IsOptional() @IsNumber() @Min(0) @Max(5) star?: number;
}

export class UpdateReplyDto {
  @IsOptional() @IsString() text?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(5) star?: number;
}
