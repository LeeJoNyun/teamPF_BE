import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto } from './dto/reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(@Body() dto: ReservationDto) {
    const saved = await this.reservationService.create(dto);
    return {
      error: 0,
      message: '',
      data: { id: saved._id, ...saved.toObject?.() }, // 필요 없으면 id만 내려도 됨
    };
  }

  @Get('user/:userId')
  async listByUser(@Param('userId') userId: string) {
    // 프론트는 배열을 기대하므로 가공 없이 그대로 반환
    return this.reservationService.findByUser(userId);
  }

  @Get()
  async adminList(@Query('type') type?: string) {
    return this.reservationService.adminList(type);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.reservationService.findById(id);
  }

  @Patch(':id/cancel')
  async cancelReservation(@Param('id') id: string) {
    const userId = undefined; // req.user?.id 등
    return this.reservationService.cancelReservation(id);
  }
}
