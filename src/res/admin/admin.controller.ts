import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/adminLogin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async validateUser(@Body() dto: AdminLoginDto) {
    return this.adminService.validateUser(dto.id, dto.password);
  }

  @Post('register')
  async registerAdmin(@Body() dto: AdminLoginDto){
    return this.adminService.registerAdmin(dto.id, dto.password);
  }
  
}
