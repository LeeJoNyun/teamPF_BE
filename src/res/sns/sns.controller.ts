import { Body, Controller, Post } from '@nestjs/common';
import { SnsService } from './sns.service';
import { GoogleDto } from './dto/google.dto';
import { RegisterDto } from './dto/register.dto';
import { KakaoDto } from './dto/kakao.dto';

@Controller('sns')
export class SnsController {
  constructor(private readonly snsService: SnsService) {}

  @Post('google')
  async exchangeGoogle(@Body() dto: GoogleDto) {
    return this.snsService.exchangeGoogleCode(dto.code, dto.code_verifier);
  }
  @Post('kakao')
  async exchangeKakao(@Body() dto: KakaoDto) {
    return this.snsService.exchangeKakaoCode(dto.type, dto.email);
  }

  @Post('register')
  async snsInfoRegister(@Body() dto: RegisterDto) {
    return this.snsService.snsInfoRegister(dto.type, dto.email, dto.userId);
  }
}
