import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async validateUser(@Body() dto: LoginDto) {
    return this.loginService.validateUser(dto.email, dto.password);
  }
}
