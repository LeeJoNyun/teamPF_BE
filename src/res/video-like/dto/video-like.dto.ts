import { IsMongoId } from 'class-validator';

export class CreateVideoLikeDto {
  @IsMongoId() userId: string;
  @IsMongoId() videoId: string;
}
