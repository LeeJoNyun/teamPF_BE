import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { VideoGroupService } from './video-group.service';
import { CreateVideoGroupDto } from './dto/video-group.dto';

@Controller('videoGroup')
export class VideoGroupController {
  constructor(private readonly videoGroupService: VideoGroupService) {}

  @Get('/')
  async findAll() {
    return this.videoGroupService.findAll();
  }

  @Post('/')
  async addGroup(@Body() dto: CreateVideoGroupDto) {
    return this.videoGroupService.addGroup(dto.group, dto.season);
  }

  @Delete('/')
  async delete(@Param('id') id: string) {
    return this.videoGroupService.delete(id);
  }
}
