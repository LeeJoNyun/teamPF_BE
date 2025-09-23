import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VideoHistory } from 'src/schema/videoHistory.schema';
import { CreateVideoHistoryDto } from './dto/video-history.dto';

@Injectable()
export class VideoHistoryService {
  constructor(
    @InjectModel(VideoHistory.name)
    private readonly model: Model<VideoHistory>,
  ) {}

  /**
   * 히스토리 기록 (있으면 추가 X)
   * - upsert로 없을 때만 생성
   * - 이미 있으면 생성 안 하고 lastWatchedAt만 갱신(원하면 주석 해제)
   */
  async addOnce(dto: CreateVideoHistoryDto) {
    const filter = {
      userId: new Types.ObjectId(dto.userId),
      videoId: new Types.ObjectId(dto.videoId),
    };

    // ① 정말로 "있으면 아무 것도 안 함"
    const result = await this.model.updateOne(
      filter,
      {
        $setOnInsert: {
          ...filter,
          watchedAt: new Date(),
          lastWatchedAt: new Date(),
        },
        // ② 만약 재클릭시 최신시각만 갱신하고 싶다면 아래 주석 해제
        // $set: { lastWatchedAt: new Date() },
      },
      { upsert: true },
    );

    const created = result.upsertedCount > 0;
    return { created }; // true면 새로 추가됨, false면 이미 있었음
  }

  /** 사용자 히스토리 목록 (최근 본 순) */
  async listByUser(userId: string, limit = 50) {
    return this.model
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ lastWatchedAt: -1 }) // watchedAt으로 바꿔도 됨
      .limit(limit)
      .lean();
  }

  /** 특정 항목 삭제(옵션) */
  async remove(userId: string, videoId: string) {
    await this.model.deleteOne({
      userId: new Types.ObjectId(userId),
      videoId: new Types.ObjectId(videoId),
    });
    return { ok: true };
  }
}
