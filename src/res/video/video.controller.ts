import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('/')
  async findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.videoService.findAllByGroupId(id);
  }

  @Post('/')
  async create(@Body() dto: CreateVideoDto) {
    return this.videoService.createMany(dto.group, dto.season, dto.videos);
  }
}
