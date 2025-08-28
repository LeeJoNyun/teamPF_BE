import { Body, Controller, Get, Post } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('/')
  async findAll() {
    return this.videoService.findAll();
  }

  @Post('/')
  async create(@Body() dto: CreateVideoDto) {
    return this.videoService.createMany(dto.group, dto.season, dto.videos);
  }
}
