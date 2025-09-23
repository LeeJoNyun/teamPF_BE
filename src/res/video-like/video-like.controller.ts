import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VideoLikeService } from './video-like.service';
import { CreateVideoLikeDto } from './dto/video-like.dto';

@Controller('video-like')
export class VideoLikeController {
  constructor(private readonly service: VideoLikeService) {}

  @Post('toggle')
  toggle(@Body() dto: CreateVideoLikeDto) {
    return this.service.toggle(dto);
  }

  @Get()
  list(@Query('userId') userId: string) {
    return this.service.listByUser(userId);
  }
}
