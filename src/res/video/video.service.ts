import { VideoGroupService } from './../video-group/video-group.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from 'src/schema/video.schema';
import { VideoGroup } from 'src/schema/videoGroup.schema';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    private videoGroupService: VideoGroupService,
  ) {}

  async createMany(
    group: string,
    season: string,
    videos: { no: number; title: string; youtubeId: string }[],
  ) {
    const createdVideos: Video[] = [];

    // 넘겨받은 group, season 으로 videoGroup 찾기
    let groupEntity = await this.videoGroupService.findOne(group, season);
    if (!groupEntity) {
      await this.videoGroupService.addGroup(group, season);
      groupEntity = await this.videoGroupService.findOne(group, season);
    }

    // ✅ _id를 문자열로 변환하여 저장합니다.
    const groupIdAsString = groupEntity?._id.toString();

    // 기존 groupId와 동일한 영상 지우기
    await this.videoModel.deleteMany({ groupId: groupIdAsString });

    for (const v of videos) {
      const newVideo = new this.videoModel({
        group,
        groupId: groupIdAsString,
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

  async findAllByGroupId(id: string): Promise<Video[]> {
    return this.videoModel.find({ groupId: id }).exec();
  }

  async delete(id: string): Promise<any> {
    return this.videoModel.deleteOne({ id }).exec();
  }
}
