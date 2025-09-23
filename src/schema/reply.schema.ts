import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReplyDocument = HydratedDocument<Reply>;

@Schema({ collection: 'replies' })
export class Reply {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Video', required: true, index: true })
  videoId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 2000 })
  text: string;

  @Prop({ type: Number, min: 1, max: 5, default: null }) // 별점(선택)
  star?: number | null;

  @Prop({ type: Number, default: 0, min: 0 }) // 기본 0
  like: number;

  @Prop({ type: Date, default: Date.now }) // 등록 시각
  regDate: Date;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
