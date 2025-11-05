import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {Booking} from "./booking.model";

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly svc: BookingsService) {}

    @ApiOperation({ summary: 'Создание брони' })
    @ApiResponse({ status: 201, description: 'Бронь успешно создана', type: Booking })
    @Post()
    async create(@Body() dto: CreateBookingDto): Promise<Booking> {
        return this.svc.create(dto);
    }

    @ApiOperation({ summary: 'Получение брони по ID' })
    @ApiResponse({ status: 200, description: 'Информация о брони', type: Booking })
    @Get(':id')
    async get(@Param('id') id: string): Promise<Booking | null> {
        return this.svc.findOne(id);
    }

    @ApiOperation({ summary: 'Список всех броней' })
    @ApiResponse({ status: 200, description: 'Список броней', type: [Booking] })
    @Get()
    async list(): Promise<Booking[]> {
        return this.svc.findAll();
    }
}
