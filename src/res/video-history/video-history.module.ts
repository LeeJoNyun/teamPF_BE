import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VideoHistoryService } from './video-history.service';
import { VideoHistoryController } from './video-history.controller';
import {
  VideoHistory,
  VideoHistorySchema,
} from 'src/schema/videoHistory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VideoHistory.name, schema: VideoHistorySchema },
    ]),
  ],
  providers: [VideoHistoryService],
  controllers: [VideoHistoryController],
})
export class VideoHistoryModule {}
