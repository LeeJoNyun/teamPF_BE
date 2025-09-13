import { Body, Controller, Post } from '@nestjs/common';
import { SnsService } from './sns.service';
import { SnsDto } from './dto/sns.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('sns')
export class SnsController {
  constructor(private readonly snsService: SnsService) {}

  @Post('google')
  async exchangeGoogle(@Body() dto: SnsDto) {
    return this.snsService.exchangeGoogleCode(dto.code, dto.code_verifier);
  }

  @Post('register')
  async snsInfoRegister(@Body() dto: RegisterDto) {
    return this.snsService.snsInfoRegister(dto.type, dto.email, dto.userId);
  }
}
