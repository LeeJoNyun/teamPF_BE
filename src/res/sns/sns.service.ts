import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Sns, SnsDocument } from 'src/schema/sns.schema';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class SnsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Sns.name) private readonly snsModel: Model<SnsDocument>,
  ) {}

  async exchangeGoogleCode(code: string) {
    // 1) 토큰 교환
    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.FRONT_ORIGIN}/authcallback`, // 콘솔 등록값과 100% 일치
        grant_type: 'authorization_code',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const token = tokenRes.data; // { access_token, id_token, ... }

    // 2) 사용자 정보
    const { data: googleUser } = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${token.access_token}` } },
    );

    // 3) sns 연동 계정 확인
    const user = await this.snsModel.findOneAndUpdate(
      { snsEmail: googleUser.email, type: 'google' },
      {
        userId: '',
        snsEmail: googleUser.email,
        type: 'google',
      },
      { new: true, upsert: true },
    );

    return user;
  }
}
