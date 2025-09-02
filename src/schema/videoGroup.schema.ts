import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VideoGroupDocument = HydratedDocument<VideoGroup>;

@Schema({ collection: 'videoGroup' })
export class VideoGroup {
  // @Prop()
  // _id: string;
  @Prop()
  group: string;
  @Prop()
  season: string;
}

export const VideoGroupSchema = SchemaFactory.createForClass(VideoGroup);
