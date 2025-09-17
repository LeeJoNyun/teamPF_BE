import { UserDto } from './dto/user.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { DuplicateDto } from './dto/duplicate.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async registerUser(@Body() dto: UserDto) {
    return this.userService.registerUser(
      dto.name,
      dto.email,
      dto.password,
      dto.phone,
      dto.birth,
      // dto.gender,
    );
  }

  @Post('/duplicate')
  async findOne(@Body() dto: DuplicateDto) {
    return this.userService.findOne(dto.email);
  }

  @Get()
  async userList(){
    return this.userService.findAll();
  }
}
