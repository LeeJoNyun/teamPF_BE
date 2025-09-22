import { IsString } from 'class-validator';

export class GoogleDto {
  @IsString()
  code: string;

  @IsString()
  code_verifier: string;
}

export class GoogleResponseDto {
  name: string;
  email: string;
  phone: string;
  birth: string;
  picture: string;
}

export class GoogleRegisterDto {
  @IsString()
  code: string;

  @IsString()
  code_verifier: string;

  @IsString()
  userId: string;
}
