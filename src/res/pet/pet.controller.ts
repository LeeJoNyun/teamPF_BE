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
import { PetService } from './pet.service';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';

@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  create(@Body() dto: CreatePetDto) {
    console.log('왔능가?');
    return this.petService.create(dto);
  }

  // /pets?userId=...
  @Get()
  list(@Query('userId') userId: string) {
    return this.petService.listByUser(userId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.petService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    return this.petService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petService.remove(id);
  }
}
