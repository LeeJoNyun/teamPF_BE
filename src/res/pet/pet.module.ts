import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { Pet, PetSchema } from 'src/schema/pet.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }])],
  providers: [PetService],
  controllers: [PetController],
})
export class PetModule {}
