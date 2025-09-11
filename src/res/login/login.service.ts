import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { UserResponseDto } from './dto/response.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async validateUser(email: string, password: string) {
    const emailExists = await this.userModel.findOne({ email });
    if (!emailExists) {
      return { error: -1, message: 'email not exist' };
    }
    const user = await this.userModel
      .findOne({ email, password })
      .select('name email phone birth')
      .lean();

    if (!user) {
      return { error: -2, message: 'wrong password' };
    }

    return { error: 0, message: '', user: user as UserResponseDto };
  }
}
