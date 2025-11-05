"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableAllocationChecker = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const table_model_1 = require("./table.model");
const booking_model_1 = require("../booking.model");
let TableAllocationChecker = class TableAllocationChecker {
    async allocate(restaurantId, start, end, excludeId, guests = 1) {
        // 1️⃣ Получаем все активные столики ресторана
        const tables = await table_model_1.RestaurantTable.findAll({
            where: { restaurantId, isActive: true },
            order: [['seats', 'ASC']], // Сначала маленькие
        });
        // 2️⃣ Перебираем столики
        for (const table of tables) {
            if (table.seats < guests)
                continue;
            // 3️⃣ Проверяем конфликты по restaurantId + tableNumber
            const conflicts = await booking_model_1.Booking.findAll({
                where: {
                    restaurantId,
                    tableNumber: table.tableNumber,
                    id: excludeId ? { [sequelize_1.Op.ne]: excludeId } : { [sequelize_1.Op.ne]: null },
                    datetime: {
                        [sequelize_1.Op.lt]: end, // начало брони раньше окончания проверяемой
                    },
                },
            });
            let hasOverlap = false;
            for (const booking of conflicts) {
                const bookingStart = new Date(booking.datetime);
                const bookingEnd = new Date(bookingStart.getTime() + (booking.durationMinutes || 90) * 60000);
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
};
exports.TableAllocationChecker = TableAllocationChecker;
exports.TableAllocationChecker = TableAllocationChecker = __decorate([
    (0, common_1.Injectable)()
], TableAllocationChecker);
//# sourceMappingURL=table-allocation-checker.js.map