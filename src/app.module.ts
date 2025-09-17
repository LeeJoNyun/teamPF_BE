import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './res/video/video.module';
import { VideoController } from './res/video/video.controller';
import { VideoService } from './res/video/video.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { SnsModule } from './res/sns/sns.module';
import { UserModule } from './res/user/user.module';
import { LoginModule } from './res/login/login.module';
import { AdminModule } from './res/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    VideoModule,
    SnsModule,
    UserModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB'),
      }),
    }),
    VideoModule,
    LoginModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
