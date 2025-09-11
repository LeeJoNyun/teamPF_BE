import { IsString } from 'class-validator';

export class DuplicateDto {
  @IsString()
  email: string;
}
