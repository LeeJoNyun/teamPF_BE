// src/video/schemas/video.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Category, Limit } from 'src/res/video/dto/createVideo.dto';

export type VideoDocument = HydratedDocument<Video>;

@Schema({ collection: 'video' })
export class Video {
  @Prop({ required: true }) koTitle: string;
  @Prop({ required: true }) enTitle: string;

  @Prop({ required: true }) year: number;
  @Prop({ type: String, enum: Object.values(Limit), required: true }) limit: Limit;
  @Prop({ type: String, enum: Object.values(Category), required: true }) category: Category;

  @Prop({ required: true }) runtimeMin: number;
  @Prop({ required: true }) youtubeId: string;

  @Prop() description?: string;

  // 업로드 결과(정적 URL)
  @Prop() visual?: string; // /video/xxx.jpg
  @Prop() thumb?: string;  // /video/xxx.jpg


}

export const VideoSchema = SchemaFactory.createForClass(Video);
