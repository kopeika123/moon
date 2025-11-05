import {IsString, IsISO8601, IsInt, Min, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateBookingDto {
    @ApiProperty({ description: 'ID ресторана', example: 'rest-1' })
    @IsString()
    restaurantId: string;

    @ApiProperty({ description: 'Дата и время в ISO', example: '2025-11-04T19:00:00.000Z' })
    @IsISO8601()
    datetime: Date;

    @ApiProperty({ description: 'Количество гостей', example: 4 })
    @IsInt()
    @Min(1)
    guests: number;

    @ApiProperty({ description: 'Длительность в минутах', example: 60})
    @IsOptional()
    @IsInt()
    durationMinutes?: number;

    @ApiProperty({ description: 'Столик', example: 1})
    @IsOptional()
    @IsInt()
    tableNumber?: number;
}
