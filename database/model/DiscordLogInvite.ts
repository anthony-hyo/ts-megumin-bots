import {BelongsTo, Column, DataType, Model, Table} from 'sequelize-typescript'
import DiscordUser from "./DiscordUser"
import DiscordGuild from "./DiscordGuild"
import DiscordInvite from "./DiscordInvite"

@Table({
	tableName: 'discord_logs_invites',
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

	@BelongsTo(() => DiscordGuild, {
		foreignKey: "guildId",
		targetKey: "guildId",
		as: "guild",
		onUpdate: 'CASCADE',
		onDelete: 'RESTRICT',
	})
	guild!: DiscordGuild;

	@BelongsTo(() => DiscordUser, {
		foreignKey: "userId",
		targetKey: "userId",
		as: "user",
		onUpdate: 'CASCADE',
		onDelete: 'RESTRICT',
	})
	user!: DiscordUser;

	@BelongsTo(() => DiscordInvite, {
		foreignKey: "inviteCode",
		targetKey: "code",
		as: "invite",
		onUpdate: 'CASCADE',
		onDelete: 'RESTRICT',
	})
	invite!: DiscordInvite;

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: ``
	})
	guildId!: string

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: ``
	})
	userId!: string

	@Column({
		type: DataType.STRING(32),
		allowNull: true,
		defaultValue: ``
	})
	inviteCode!: string | null

	@Column({
		type: DataType.TEXT,
		allowNull: false
	})
	type!: string

}
