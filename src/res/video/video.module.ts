import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video, VideoSchema } from 'src/schema/video.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoGroupModule } from '../video-group/video-group.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    VideoGroupModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
