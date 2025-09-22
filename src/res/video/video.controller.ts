// src/video/video.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { VideoService } from './video.service';
import { CreateVideoDto, UpdateVideoDto } from './dto/video.dto';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'video');

// 저장 폴더 보장
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
function filename(_: any, file: Express.Multer.File, cb: Function) {
  const ts = Date.now();
  cb(null, `${file.fieldname}_${ts}${extname(file.originalname)}`);
}

const multerOptions = {
  storage: diskStorage({
    destination: (_: any, __: any, cb: Function) => {
      ensureUploadDir();
      cb(null, UPLOAD_DIR);
    },
    filename,
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
};

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('/')
  async findAll() {
    return this.videoService.findAll();
  }

  // 기존 호환: 그룹별
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  /** 🔵 단건 생성 + 이미지 업로드(visual, thumb) */
  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'visual', maxCount: 1 },
        { name: 'thumb', maxCount: 1 },
      ],
      multerOptions, // ✅ POST에도 저장소 설정
    ),
  )
  async create(
    @Body() dto: CreateVideoDto,
    @UploadedFiles()
    files: { visual?: Express.Multer.File[]; thumb?: Express.Multer.File[] },
  ) {
    // 파일이 있으면 정적 URL 생성 (/video/** 로 서빙)
    const visualUrl = files.visual?.[0]
      ? `/video/${files.visual[0].filename}`
      : undefined;
    const thumbUrl = files.thumb?.[0]
      ? `/video/${files.thumb[0].filename}`
      : undefined;

    // DTO가 runtime 라는 이름이면 스키마의 runtimeMin으로 매핑
    const payload: any = { ...dto };
    if (payload.runtime != null && payload.runtimeMin == null) {
      payload.runtimeMin = Number(payload.runtime);
      delete payload.runtime;
    }

    return this.videoService.createOne(payload, { visualUrl, thumbUrl });
  }

  /** 🔵 수정(파일은 선택 업로드) */
  @Patch('/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'visual', maxCount: 1 },
        { name: 'thumb', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  async updateOne(
    @Param('id') id: string,
    @Body() dto: UpdateVideoDto,
    @UploadedFiles()
    files: { visual?: Express.Multer.File[]; thumb?: Express.Multer.File[] },
  ) {
    const visualUrl = files.visual?.[0]
      ? `/video/${files.visual[0].filename}`
      : undefined;
    const thumbUrl = files.thumb?.[0]
      ? `/video/${files.thumb[0].filename}`
      : undefined;
    return this.videoService.updateOne(id, dto, { visualUrl, thumbUrl });
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return this.videoService.removeOne(id);
  }
}
