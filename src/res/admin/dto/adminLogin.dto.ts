import { IsString } from 'class-validator';

export class AdminLoginDto {
  @IsString()
  id: string;

  @IsString()
  password: string;
}
