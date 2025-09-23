import { IsMongoId } from 'class-validator';

export class CreateVideoHistoryDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  videoId: string;
}
