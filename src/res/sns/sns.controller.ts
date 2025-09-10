import { Body, Controller, Post } from '@nestjs/common';
import { SnsService } from './sns.service';
import { SnsDto } from './dto/sns.dto';

@Controller('sns')
export class SnsController {
  constructor(private readonly snsService: SnsService) {}

  @Post('google')
  async exchangeGoogle(@Body() dto: SnsDto) {
    return this.snsService.exchangeGoogleCode(dto.code);
  }
}
