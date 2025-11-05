import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {RestaurantTable} from "./table.model";
import {Booking} from "../booking.model";


@Injectable()
export class TableAllocationChecker {
    async allocate(
        restaurantId: string,
        start: Date,
        end: Date,
        excludeId?: string,
        guests: number = 1,
    ): Promise<number | null> {
        // 1️⃣ Получаем все активные столики ресторана
        const tables = await RestaurantTable.findAll({
            where: { restaurantId, isActive: true },
            order: [['seats', 'ASC']], // Сначала маленькие
        });

        // 2️⃣ Перебираем столики
        for (const table of tables) {
            if (table.seats < guests) continue;

            // 3️⃣ Проверяем конфликты по restaurantId + tableNumber
            const conflicts = await Booking.findAll({
                where: {
                    restaurantId,
                    tableNumber: table.tableNumber,
                    id: excludeId ? { [Op.ne]: excludeId } : { [Op.ne]: null },
                    datetime: {
                        [Op.lt]: end, // начало брони раньше окончания проверяемой
                    },
                },
            });

            let hasOverlap = false;
            for (const booking of conflicts) {
                const bookingStart = new Date(booking.datetime);
                const bookingEnd = new Date(
                    bookingStart.getTime() + (booking.durationMinutes || 90) * 60000,
                );

                // Проверяем пересечение во времени
                if (bookingStart < end && bookingEnd > start) {
                    hasOverlap = true;
                    break;
                }
            }

            // 4️⃣ Если пересечений нет — возвращаем этот стол
            if (!hasOverlap) {
                return table.tableNumber;
            }
        }

        // 5️⃣ Нет доступных столов
        return null;
    }
}
