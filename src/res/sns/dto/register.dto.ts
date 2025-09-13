import { IsIn, IsMongoId, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  email: string;

  @IsString()
  @IsIn(['google', 'kakao', 'naver'])
  type: string;

  @IsString()
  @IsMongoId()
  userId: string;
}
