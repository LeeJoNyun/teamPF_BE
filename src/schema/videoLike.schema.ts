import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VideoLikeDocument = HydratedDocument<VideoLike>;

@Schema({ collection: 'video_likes', timestamps: true })
export class VideoLike {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Video', required: true, index: true })
  videoId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  likedAt: Date;
}

export const VideoLikeSchema = SchemaFactory.createForClass(VideoLike);

// (userId, videoId) 유니크 → 중복 찜 방지
VideoLikeSchema.index({ userId: 1, videoId: 1 }, { unique: true });
