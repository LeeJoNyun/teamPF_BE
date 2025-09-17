import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
import * as fs from 'fs';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow requests from this origin
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true }, 
  forbidNonWhitelisted: true,
}));

  const uploadsRoot = join(process.cwd(), 'uploads');
  const videoDir = join(uploadsRoot, 'video');
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

  // 정적 파일 매핑: /video/** → uploads/video/**
  app.use('/video', express.static(videoDir));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
