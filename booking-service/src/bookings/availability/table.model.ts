import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({ tableName: 'restaurant_tables', timestamps: false })
export class RestaurantTable extends Model<RestaurantTable> {
    @Column({primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    restaurantId: number;

    @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null})
    tableNumber: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    capacity: number;

    @Column({ type: DataType.STRING, allowNull: false })
    location: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    seats: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    isActive: boolean;
}
