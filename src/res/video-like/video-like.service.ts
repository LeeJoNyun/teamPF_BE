import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VideoLike } from 'src/schema/videoLike.schema';
import { CreateVideoLikeDto } from './dto/video-like.dto';

@Injectable()
export class VideoLikeService {
  constructor(
    @InjectModel(VideoLike.name) private readonly model: Model<VideoLike>,
  ) {}

  /** 토글: 있으면 삭제(취소), 없으면 생성 */
  async toggle(dto: CreateVideoLikeDto) {
    const filter = {
      userId: new Types.ObjectId(dto.userId),
      videoId: new Types.ObjectId(dto.videoId),
    };

    const del = await this.model.deleteOne(filter);
    if (del.deletedCount && del.deletedCount > 0) {
      return { liked: false };
    }

    await this.model.updateOne(
      filter,
      { $setOnInsert: { ...filter, likedAt: new Date() } },
      { upsert: true },
    );
    return { liked: true };
  }

  /** 사용자 찜 목록 (비디오 간단 정보까지 합쳐서 주면 프런트가 편함) */
  async listByUser(userId: string, limit = 100) {
    const rows = await this.model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ likedAt: -1 })
      .limit(limit)
      .populate('videoId', 'koTitle visual thumb') // 핵심
      .lean();

    // 프런트가 쓰기 쉽게 평탄화
    return rows.map((r) => ({
      _id: r._id,
      videoId: (r as any).videoId?._id || r.videoId,
      koTitle: (r as any).videoId?.koTitle ?? '',
      visual: (r as any).videoId?.visual ?? (r as any).videoId?.thumb ?? '',
      likedAt: r.likedAt,
    }));
  }
}
