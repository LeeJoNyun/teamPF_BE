import { IsIn, IsMongoId, IsString } from 'class-validator';

export class KakaoDto {
  @IsString()
  email: string;

  @IsString()
  @IsIn(['google', 'kakao', 'naver'])
  type: string;
}
