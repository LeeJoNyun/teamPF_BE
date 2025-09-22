import { IsString } from 'class-validator';

export class GoogleDto {
  @IsString()
  code: string;

  @IsString()
  code_verifier: string;

  @IsString()
  type: string;
}

export class GoogleResponseDto {
  name: string;
  email: string;
  phone: string;
  birth: string;
  picture: string;
}
