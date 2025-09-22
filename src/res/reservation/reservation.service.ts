import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import {
  Reservation,
  ReservationDocument,
} from 'src/schema/reservation.schema';
import { ReservationDto } from './dto/reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  // 예약 등록
  async create(dto: ReservationDto) {
    // 문자열로 온 날짜를 Date로 변환(스키마가 Date | string 이어도 Date 권장)
    const doc = new this.reservationModel({
      ...dto,
      regDate: new Date(dto.regDate),
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      status: 1,
    });

    return await doc.save();
  }

  async findByUser(userId: string) {
    try {
      return await this.reservationModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    } catch (e) {
      throw new InternalServerErrorException('reservation_list_failed');
    }
  }

  async adminList(type?: string) {
    try {
      const q: any = {};
      if (type) q.resType = type; // 'hotel' | 'grooming'
      return await this.reservationModel
        .find(q)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
    } catch (e) {
      throw new InternalServerErrorException('reservation_admin_list_failed');
    }
  }
  async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid_reservation_id'); // 400
    }

    const doc = await this.reservationModel.findById(id).lean().exec();
    if (!doc) {
      throw new NotFoundException('reservation_not_found'); // 404
    }
    return doc;
  }

  async cancelReservation(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid_reservation_id'); // 400
    }
    const updated = await this.reservationModel
      .findOneAndUpdate(
        { _id: id, status: { $ne: -1 } }, // 중복 취소 방지
        {
          $set: {
            status: -1,
            canceledAt: new Date(),
          },
        },
        { new: true },
      )
      .lean()
      .exec();

    if (!updated) {
      throw new BadRequestException('reservation_cancel_failed');
    }

    // (TODO) 쿠폰 복구 등 부수 처리 필요 시 여기서 수행
    return updated;
  }
}
