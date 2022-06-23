import {BelongsTo, Column, DataType, Model, Table} from 'sequelize-typescript'
import DiscordGuild from "./DiscordGuild"
import DiscordUser from "./DiscordUser"

@Table({
	tableName: 'discord_invites',
	indexes: [
		{
			name: "PRIMARY",
			unique: true,
			using: "BTREE",
			fields: [
				{name: "code"},
			]
		},
		{
			name: "code_guildId_inviterId",
			unique: true,
			using: "BTREE",
			fields: [
				{name: "code"},
				{name: "guildId"},
				{name: "inviterId"},
			]
		},
	]
})
export default class DiscordInvite extends Model {

	@BelongsTo(() => DiscordGuild, {
		foreignKey: "guildId",
		targetKey: "guildId",
		as: "guild",
		onUpdate: 'CASCADE',
		onDelete: 'RESTRICT',
	})
	guild!: DiscordGuild;

	@BelongsTo(() => DiscordUser, {
		foreignKey: "inviterId",
		targetKey: "userId",
		as: "inviter",
		onUpdate: 'CASCADE',
		onDelete: 'RESTRICT',
	})
	inviter!: DiscordUser;

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: ``
	})
	code!: string

	@Column({
		type: DataType.STRING(32),
		allowNull: true,
		defaultValue: ``
	})
	channelId!: string | null

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
	guildId!: string | null

	@Column({
		type: DataType.STRING(32),
		allowNull: true
	})
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
