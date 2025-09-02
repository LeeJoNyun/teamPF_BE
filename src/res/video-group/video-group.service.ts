import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoGroup, VideoGroupDocument } from 'src/schema/videoGroup.schema';

@Injectable()
export class VideoGroupService {
  constructor(
    @InjectModel(VideoGroup.name)
    private videoGroupModel: Model<VideoGroupDocument>,
  ) {}

  async findAll(): Promise<VideoGroup[]> {
    return this.videoGroupModel.find().exec();
  }

  async findOne(group: string, season: string) {
    return this.videoGroupModel.findOne({ group, season }).exec();
  }
  async addGroup(group: string, season: string) {
    const createdGroups: VideoGroup[] = [];

    const newGroup = new this.videoGroupModel({ group, season });
    const saved = await newGroup.save();

    createdGroups.push(saved);

    return createdGroups;
  }

  async delete(_id: string): Promise<any> {
    return this.videoGroupModel.deleteOne({ _id }).exec();
  }
}
