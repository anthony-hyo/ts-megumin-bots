import {BelongsTo, Column, DataType, Model, Table} from 'sequelize-typescript'
import DiscordUser from "./DiscordUser"
import DiscordGuild from "./DiscordGuild"
import DiscordInvite from "./DiscordInvite"

@Table({
    tableName: 'logs_invites',
    indexes: [
        {
            name: "guildId_userId_inviteCode",
            unique: true,
            using: "BTREE",
            fields: [
                {name: "guildId"},
                {name: "userId"},
                {name: "inviteCode"},
            ]
        },
    ]
})
export default class DiscordLogInvite extends Model {

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        defaultValue: ``
    })
    @BelongsTo(() => DiscordGuild, {
        foreignKey: "guildId",
        targetKey: "guildId",
        as: "LogGuildId",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    guildId!: string

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        defaultValue: ``
    })
    @BelongsTo(() => DiscordUser, {
        foreignKey: "userId",
        targetKey: "userId",
        as: "LogUserId",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    userId!: string

    @Column({
        type: DataType.STRING(32),
        allowNull: true,
        defaultValue: ``
    })
    @BelongsTo(() => DiscordInvite, {
        foreignKey: "inviteCode",
        targetKey: "code",
        as: "LogInviteCode",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    inviteCode!: string | null

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    type!: string

}
