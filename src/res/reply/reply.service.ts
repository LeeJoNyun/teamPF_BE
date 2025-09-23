import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reply } from 'src/schema/reply.schema';
import { CreateReplyDto } from './dto/reply.dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(Reply.name) private readonly replyModel: Model<Reply>,
  ) {}

  async create(dto: CreateReplyDto) {
    return this.replyModel.create({
      ...dto,
      userId: new Types.ObjectId(dto.userId),
      videoId: new Types.ObjectId(dto.videoId),
      like: 0, // 기본값 보장
      regDate: new Date(),
    });
  }

  async listByVideo(videoId: string) {
    return this.replyModel
      .find({ videoId: new Types.ObjectId(videoId) })
      .sort({ regDate: -1 })
      .lean();
  }
}
