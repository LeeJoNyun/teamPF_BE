import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VideoHistoryService } from './video-history.service';
import { CreateVideoHistoryDto } from './dto/video-history.dto';

@Controller('video-history')
export class VideoHistoryController {
  constructor(private readonly service: VideoHistoryService) {}

  @Post()
  add(@Body() dto: CreateVideoHistoryDto) {
    return this.service.addOnce(dto);
  }

  @Get()
  list(@Query('userId') userId: string, @Query('limit') limit?: string) {
    return this.service.listByUser(userId, Number(limit) || 50);
  }
}
