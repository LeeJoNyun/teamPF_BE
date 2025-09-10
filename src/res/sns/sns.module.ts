import { Module } from '@nestjs/common';
import { SnsService } from './sns.service';
import { SnsController } from './sns.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { Sns, SnsSchema } from 'src/schema/sns.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Sns.name, schema: SnsSchema }]),
  ],

  controllers: [SnsController],
  providers: [SnsService],
})
export class SnsModule {}
