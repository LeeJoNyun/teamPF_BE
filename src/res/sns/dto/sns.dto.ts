import { IsString } from 'class-validator';

export class SnsDto {
  @IsString()
  code: string;

  @IsString()
  code_verifier: string;
}
