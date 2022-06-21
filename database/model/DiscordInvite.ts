import {BelongsTo, Column, DataType, Index, Model, Table} from 'sequelize-typescript'
import DiscordGuild from "./DiscordGuild"
import DiscordUser from "./DiscordUser"

@Table({
    tableName: 'discord_invites',
})
export default class DiscordInvite extends Model {

    @Column({
        type: DataType.STRING(32),
        allowNull: true,
        defaultValue: ``
    })
    channelId!: string | null

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        defaultValue: ``
    })
    @Index({
        name: 'CodeGuildInviter',
        type: 'UNIQUE',
        unique: true,
    })
    code!: string

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    })
    isDeletable!: boolean

    @Column({
        type: DataType.STRING(32),
        allowNull: true
    })
    @BelongsTo(() => DiscordGuild, {
        foreignKey: "guildId",
        targetKey: "guildId",
        as: "InviteGuildId",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    @Index('CodeGuildInviter')
    guildId!: string | null

    @Column({
        type: DataType.STRING(32),
        allowNull: true
    })
    @BelongsTo(() => DiscordUser, {
        foreignKey: "inviterId",
        targetKey: "userId",
        as: "InviteInviterId",
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    @Index('CodeGuildInviter')
    inviterId!: string | null

    @Column({
        type: DataType.STRING(32),
        allowNull: false,
        defaultValue: `normal`
    })
    inviteType!: string

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: null
    })
    maxAge!: number | null

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: null
    })
    maxUses!: number | null

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    })
    isTemporary!: boolean

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 0
    })
    uses!: number | null

    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: null
    })
    expiresAt!: Date | null

}
