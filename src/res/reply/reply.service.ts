// reply.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reply } from 'src/schema/reply.schema';
import { CreateReplyDto, UpdateReplyDto } from './dto/reply.dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name) private readonly replyModel: Model<Reply>,
  ) {}

  private oid(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return new Types.ObjectId(id);
  }

  /** 댓글 작성 */
  async create(dto: CreateReplyDto) {
    const doc = await this.replyModel.create({
      userId: this.oid(dto.userId),
      videoId: this.oid(dto.videoId),
      text: dto.text?.trim(),
      star: Math.max(0, Math.min(5, Number(dto.star ?? 0))), // 0~5 clamp
      like: 0,
      regDate: new Date(),
    });
    return doc.toObject();
  }

  /** 영상별 댓글 목록 (페이지네이션) */
  async listByVideo(videoId: string, page = 1, limit = 20) {
    const filter = { videoId: this.oid(videoId) };
    page = Math.max(1, Number(page));
    limit = Math.min(100, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
      this.replyModel
        .find(filter)
        .sort({ regDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.replyModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }

  /** 내가 쓴 댓글 (마이페이지) – 영상 제목/이미지까지 같이 */
  async listByUser(userId: string, page = 1, limit = 20) {
    const filter = { userId: this.oid(userId) };
    page = Math.max(1, Number(page));
    limit = Math.min(100, Math.max(1, Number(limit)));

    const [rows, total] = await Promise.all([
      this.replyModel
        .find(filter)
        .sort({ regDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('videoId', 'koTitle visual thumb') // <- 비디오 핵심 필드
        .lean(),
      this.replyModel.countDocuments(filter),
    ]);

    // 프론트가 쓰기 좋게 평탄화
    const items = rows.map((r: any) => ({
      _id: r._id,
      userId: r.userId,
      videoId: r.videoId?._id ?? r.videoId,
      text: r.text,
      star: r.star,
      like: r.like,
      regDate: r.regDate,
      video: {
        id: r.videoId?._id ?? r.videoId,
        koTitle: r.videoId?.koTitle ?? '',
        visual: r.videoId?.visual ?? r.videoId?.thumb ?? '',
      },
    }));

    return { items, total, page, limit };
  }

  /** 댓글 수정 (본문/별점) */
  async update(id: string, patch: UpdateReplyDto) {
    const set: any = {};
    if (patch.text !== undefined) set.text = patch.text.trim();
    if (patch.star !== undefined)
      set.star = Math.max(0, Math.min(5, Number(patch.star)));

    const updated = await this.replyModel
      .findByIdAndUpdate(this.oid(id), { $set: set }, { new: true })
      .lean();

    if (!updated) throw new BadRequestException('Reply not found');
    return updated;
  }

  /** 댓글 삭제 */
  async remove(id: string) {
    const res = await this.replyModel.findByIdAndDelete(this.oid(id)).lean();
    if (!res) throw new BadRequestException('Reply not found');
    return { deleted: true };
  }

  /** 좋아요 증감 (예: +1 / -1) */
  async incLike(id: string, amount = 1) {
    const updated = await this.replyModel
      .findByIdAndUpdate(
        this.oid(id),
        { $inc: { like: Number(amount) } },
        { new: true },
      )
      .lean();
    if (!updated) throw new BadRequestException('Reply not found');
    return updated;
  }

  /** 해당 영상의 댓글 통계 (개수, 평균 별점) */
  async statsForVideo(videoId: string) {
    const [row] = await this.replyModel.aggregate([
      { $match: { videoId: this.oid(videoId) } },
      {
        $group: {
          _id: '$videoId',
          count: { $sum: 1 },
          avgStar: { $avg: '$star' },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          avgStar: { $round: ['$avgStar', 2] },
        },
      },
    ]);
    return row || { count: 0, avgStar: 0 };
  }
}
