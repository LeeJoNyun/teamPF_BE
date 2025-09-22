import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { isValidObjectId, Model } from 'mongoose';
import { Sns, SnsDocument } from 'src/schema/sns.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { UserResponseDto } from '../login/dto/response.dto';
import { GoogleResponseDto } from './dto/google.dto';

@Injectable()
export class SnsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Sns.name) private readonly snsModel: Model<SnsDocument>,
  ) {}

  async snsInfoRegister(type: string, email: string, userId: string) {
    try {
      await this.snsModel.findOneAndUpdate(
        { type, snsEmail: email, userId },
        { $set: { type, snsEmail: email, userId } },
        { upsert: true, new: true },
      );
    } catch {
      throw new BadRequestException('register error');
    }
    return { error: 0 };
  }
  /**
   * 구글 코드 → 토큰 → 유저 이메일 취득
   * SNS 테이블에서 (type: 'google', snsEmail) 조회만 하고,
   * userId가 있으면 users에서 상세를 읽어 반환한다.
   * userId 없으면 user: null 로 반환하여 프론트가 회원가입 판단.
   */
  async exchangeGoogleCode(code: string, code_verifier?: string) {
    const redirectUri = `${process.env.FRONT_ORIGIN!.replace(/\/$/, '')}/authcallback`;

    // 1) 토큰 교환
    const p = new URLSearchParams();
    p.set('code', code); // 브라우저가 이미 디코딩된 "4/..." 형태를 줌
    p.set('client_id', process.env.GOOGLE_CLIENT_ID!);
    p.set('client_secret', process.env.GOOGLE_CLIENT_SECRET!);
    p.set('redirect_uri', redirectUri);
    p.set('grant_type', 'authorization_code');
    if (code_verifier) p.set('code_verifier', code_verifier); // PKCE

    let token: any;
    try {
      const { data } = await axios.post(
        'https://oauth2.googleapis.com/token',
        p.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          timeout: 7000,
        },
      );

      token = data;
    } catch (e: any) {
      const g = e?.response?.data;

      throw new BadRequestException(
        `${g?.error || 'token_error'}: ${g?.error_description || 'unknown'}`,
      );
    }

    // 2) 구글 유저 정보(이메일)
    let googleUser: any;
    try {
      const { data } = await axios.get(
        'https://openidconnect.googleapis.com/v1/userinfo',
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
          timeout: 7000,
        },
      );
      googleUser = data; // { email, name, picture, ... }
    } catch {
      throw new BadRequestException('failed_to_fetch_userinfo');
    }

    const email = googleUser?.email;
    if (!email) throw new BadRequestException('google_email_missing');

    // 3) SNS 테이블에서 "조회만"
    const link = await this.snsModel
      .findOne({ type: 'google', snsEmail: email })
      .lean<{ userId?: string | null }>();

    let user: any = null;
    if (link?.userId) {
      user = await this.userModel
        .findById(link.userId)
        .select('name email phone birth')
        .lean();
    }
    user = { ...user, profile: googleUser.picture };
    // 4) 프론트에서 판단할 수 있도록 반환 형식 통일
    return {
      provider: 'google',
      snsEmail: email,
      // 이미 연동되어 있으면 유저 정보, 아니면 null
      user: (user as GoogleResponseDto) || null,
      // 프론트가 바로 쓰기 좋게 flag도 포함
      isLinked: Boolean(user),
    };
  }

  async exchangeKakaoCode(type: string, email: string) {
    const link = await this.snsModel
      .findOne({ type, snsEmail: email })
      .lean<{ userId?: string | null }>();

    let user: any = null;
    if (link?.userId) {
      user = await this.userModel
        .findById(link.userId)
        .select('name email phone birth')
        .lean();
    }

    // 4) 프론트에서 판단할 수 있도록 반환 형식 통일
    return {
      provider: 'kakao',
      snsEmail: email,
      // 이미 연동되어 있으면 유저 정보, 아니면 null
      user: (user as GoogleResponseDto) || null,
      // 프론트가 바로 쓰기 좋게 flag도 포함
      isLinked: Boolean(user),
    };
  }

  async getLinksByUser(userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('invalid user id');
    }

    const docs = await this.snsModel
      .find({ userId })
      .select('type snsEmail createdAt updatedAt')
      .lean()
      .exec();

    // 프론트에서 바로 쓰기 좋게 가공
    return docs.map((d) => ({
      provider: d.type, // 'google' | 'kakao' …
      snsEmail: d.snsEmail,
    }));
  }
}
