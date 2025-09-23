import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VideoHistoryDocument = HydratedDocument<VideoHistory>;

@Schema({ collection: 'video_histories' })
export class VideoHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Video', required: true, index: true })
  videoId: Types.ObjectId;

  // 처음 본 시각 (있으면 추가 안 하므로 최초 기록 유지용)
  @Prop({ type: Date, default: Date.now })
  watchedAt: Date;

  // 만약 이후에 또 클릭했을 때 갱신만 하고 싶으면 아래 필드 추가해서 서비스에서 $set으로 업데이트
  @Prop({ type: Date, default: Date.now })
  lastWatchedAt: Date;
}

export const VideoHistorySchema = SchemaFactory.createForClass(VideoHistory);

// (userId, videoId) 중복 금지
VideoHistorySchema.index({ userId: 1, videoId: 1 }, { unique: true });
