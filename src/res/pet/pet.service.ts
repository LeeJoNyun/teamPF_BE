import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pet } from 'src/schema/pet.schema';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';

@Injectable()
export class PetService {
  constructor(@InjectModel(Pet.name) private readonly petModel: Model<Pet>) {}

  async create(dto: CreatePetDto) {
    return this.petModel.create({
      ...dto,
      userId: new Types.ObjectId(dto.userId),
      // age는 dto에 없으면 스키마 기본값('미입력') 적용
    });
  }

  async listByUser(userId: string) {
    return this.petModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(id: string) {
    return this.petModel.findById(id).lean();
  }

  async update(id: string, dto: UpdatePetDto) {
    if (dto.userId) (dto as any).userId = new Types.ObjectId(dto.userId);
    return this.petModel.findByIdAndUpdate(id, dto, { new: true }).lean();
  }

  async remove(id: string) {
    await this.petModel.findByIdAndDelete(id);
    return { ok: true };
  }
}
