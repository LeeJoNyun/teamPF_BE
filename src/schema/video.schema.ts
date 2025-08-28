import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VideoDocument = HydratedDocument<Video>;

@Schema({ collection: 'video' })
export class Video {
  @Prop()
  id: string;
  @Prop()
  no: number;
  @Prop()
  title: string;
  @Prop()
  group: string;
  @Prop()
  season: string;
  @Prop()
  youtubeId: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
