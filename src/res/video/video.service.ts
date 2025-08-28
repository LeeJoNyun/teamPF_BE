import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from 'src/schema/video.schema';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  async createMany(
    group: string,
    season: string,
    videos: { no: number; title: string; youtubeId: string }[],
  ) {
    const createdVideos: Video[] = [];

    for (const v of videos) {
      const newVideo = new this.videoModel({
        group,
        season,
        no: Number(v.no),
        title: v.title,
        youtubeId: v.youtubeId,
      });
      const saved = await newVideo.save();
      createdVideos.push(saved);
    }

    return createdVideos;
  }

  async findAll(): Promise<Video[]> {
    return this.videoModel.find().exec();
  }

  async findOne(id: string): Promise<Video | null> {
    return this.videoModel.findOne({ id }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.videoModel.deleteOne({ id }).exec();
  }
}
