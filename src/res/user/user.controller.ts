import { UserDto } from './dto/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

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
      dto.gender,
    );
  }
}
