// src/video/video.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';
import { Video } from 'src/schema/video.schema';

@Injectable()
export class VideoService {
  constructor(@InjectModel(Video.name) private readonly videoModel: Model<Video>) {}

  findAll() {
    return this.videoModel.find().sort({ createdAt: -1 }).lean();
  }

  findAllByGroupId(group: string) {
    return this.videoModel.find({ group }).sort({ season: 1, createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const doc = await this.videoModel.findById({id}).lean();
    if (!doc) throw new NotFoundException('Video not found');
    return doc;
  }

  // ⬇️ URL 문자열만 받아 저장 (파일 객체 금지)
  async createOne(
    dto: CreateVideoDto & { runtimeMin?: number },
    files?: { visualUrl?: string; thumbUrl?: string },
  ) {
    const doc: any = { ...dto };

    if (files?.visualUrl) doc.visual = files.visualUrl;
    if (files?.thumbUrl)  doc.thumb  = files.thumbUrl;

    if (doc.runtimeMin != null) doc.runtimeMin = Number(doc.runtimeMin);

    return this.videoModel.create(doc);
  }

  async updateOne(id: string, dto: UpdateVideoDto, files?: { visualUrl?: string; thumbUrl?: string }) {
    const update: any = { ...dto };
    if (files?.visualUrl) update.visual = files.visualUrl;
    if (files?.thumbUrl)  update.thumb  = files.thumbUrl;
    if (update.runtimeMin != null) update.runtimeMin = Number(update.runtimeMin);

    const doc = await this.videoModel.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!doc) throw new NotFoundException('Video not found');
    return doc;
  }

  async removeOne(id: string) {
    const doc = await this.videoModel.findByIdAndDelete(id).lean();
    if (!doc) throw new NotFoundException('Video not found');
    return { ok: true, id };
  }
}
