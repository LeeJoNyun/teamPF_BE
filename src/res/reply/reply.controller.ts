import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/reply.dto';

@Controller('replies')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  create(@Body() dto: CreateReplyDto) {
    return this.replyService.create(dto);
  }

  @Get('video/:videoId')
  list(@Param('videoId') videoId: string) {
    return this.replyService.listByVideo(videoId);
  }
}
