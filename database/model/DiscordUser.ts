import {Column, DataType, Model, Table} from 'sequelize-typescript'

@Table({
    tableName: 'discord_users',
    indexes: [
        {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [
                {name: "userId"},
            ]
        },
        {
            name: "id",
            unique: true,
            using: "BTREE",
            fields: [
                {name: "userId"},
            ]
        },
    ]
})
export default class DiscordUser extends Model {

    @Column({
        type: DataType.STRING(32),
        unique: true,
        primaryKey: true,
        allowNull: false
    })
    userId!: string

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        defaultValue: ``
    })
    username!: string

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        defaultValue: ``
    })
    discriminator!: string

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
        defaultValue: false
    })
    isBot!: boolean

    @Column({
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null
    })
    avatar!: string | null

    /*@Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    leaveCount: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    fakeCount: number*/

}
