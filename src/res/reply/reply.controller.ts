// reply.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto, UpdateReplyDto } from './dto/reply.dto';

@Controller('replies')
export class ReplyController {
  constructor(private readonly service: ReplyService) {}

  @Post()
  create(@Body() dto: CreateReplyDto) {
    return this.service.create(dto);
  }

  @Get()
  listByVideo(
    @Query('videoId') videoId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.listByVideo(videoId, Number(page), Number(limit));
  }

  @Get('user/:userId')
  listByUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.listByUser(userId, Number(page), Number(limit));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() patch: UpdateReplyDto) {
    return this.service.update(id, patch);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/like')
  incLike(@Param('id') id: string, @Body('amount') amount = 1) {
    return this.service.incLike(id, Number(amount));
  }

  @Get('video/:videoId/stats')
  stats(@Param('videoId') videoId: string) {
    return this.service.statsForVideo(videoId);
  }
}
