import {Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({tableName: 'bookings', timestamps: true})
export class Booking extends Model<Booking> {
    @Column({primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id: string;

    @Column({ type: DataType.STRING, allowNull: false})
    restaurantId: string;

    @Column({ type: DataType.DATE, allowNull: false})
    datetime: Date;

    @Column({ type: DataType.INTEGER, allowNull: false})
    durationMinutes: number;

    @Column({ type: DataType.INTEGER, allowNull: false})
    guests: number;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'CREATED' })
    status: string;

    @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null})
    tableNumber: number;
}
