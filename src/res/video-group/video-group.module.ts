import { Module } from '@nestjs/common';
import { VideoGroupService } from './video-group.service';
import { VideoGroupController } from './video-group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoGroup, VideoGroupSchema } from 'src/schema/videoGroup.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VideoGroup.name, schema: VideoGroupSchema },
    ]),
  ],
  controllers: [VideoGroupController],
  providers: [VideoGroupService],
  exports: [VideoGroupService],
})
export class VideoGroupModule {}
