import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // 회원가입
  async registerUser(
    name: string,
    email: string,
    password: string,
    phone: string,
    birth: string,
    // gender: string,
  ) {
    await new this.userModel({
      name,
      email,
      password,
      phone,
      birth,
      // gender,
      isDel: false,
      regDate: new Date(),
    }).save();

    return { error: 0, message: '' };
  }

  // 회원 전체 조회
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // 회원 정보 수정
  async updateUser(
    id: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  // 중복검사
  async findOne(email: string) {
    const user = this.userModel.findOne({ email }).exec();
    if (!user) {
      return { error: 0, message: 'success' };
    }
    return { error: -1, message: 'exist email' };
  }
}
