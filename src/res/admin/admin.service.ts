import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/schema/admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
  ) {}

  async validateUser(id: string, password: string) {
    const idExists = await this.adminModel.findOne({ id });
    if (!idExists) {
      return { error: -1, message: 'id not exist' };
    }
    const user = await this.adminModel.findOne({ id, password }).lean();

    if (!user) {
      return { error: -2, message: 'wrong password' };
    }

    return { error: 0, message: '' };
  }

  async registerAdmin(id:string, password: string){
    await new this.adminModel({
    id,
    password,
    regDate: new Date(),
    }).save();
     return { error: 0, message: '' };
  }
}
