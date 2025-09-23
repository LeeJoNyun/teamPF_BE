import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VideoLikeService } from './video-like.service';
import { VideoLikeController } from './video-like.controller';
import { VideoLike, VideoLikeSchema } from 'src/schema/videoLike.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VideoLike.name, schema: VideoLikeSchema },
    ]),
  ],
  providers: [VideoLikeService],
  controllers: [VideoLikeController],
})
export class VideoLikeModule {}
