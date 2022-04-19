import {Column, DataType, Model, Table} from 'sequelize-typescript'

@Table({
    tableName: 'users'
})
export default class User extends Model {

    @Column({
        type: DataType.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    id: number

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        defaultValue: ``
    })
    username: string

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        defaultValue: ``
    })
    password: string

}
