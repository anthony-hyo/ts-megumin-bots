import {BelongsTo, Column, DataType, Model, Sequelize, Table} from 'sequelize-typescript'
import DiscordUser from "./DiscordUser"

@Table({
	tableName: 'discord_guilds',
	indexes: [
		{
			name: "PRIMARY",
			unique: true,
			using: "BTREE",
			fields: [
				{name: "guildId"},
			]
		}
	]
})
export default class DiscordGuild extends Model {

	@BelongsTo(() => DiscordUser, {
		foreignKey: "ownerId",
		targetKey: "userId",
		as: "owner",
		onUpdate: 'CASCADE',
		onDelete: 'RESTRICT',
	})
	owner!: DiscordUser;

	@Column({
		unique: true,
		type: DataType.STRING(32),
		allowNull: false
	})
	guildId!: string

	@Column({
		type: DataType.INTEGER,
		allowNull: true,
		defaultValue: null
	})
	shardId!: number | null

	@Column({
		type: DataType.STRING(32),
		allowNull: true
	})
	ownerId!: string | null

	@Column({
		type: DataType.STRING(64),
		allowNull: false,
		defaultValue: ``
	})
	name!: string

	@Column({
		type: DataType.TEXT,
		allowNull: false,
		defaultValue: ``
	})
	description!: string

	@Column({
		type: DataType.STRING(5),
		defaultValue: `-`,
		allowNull: false
	})
	prefix!: string

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: `us`
	})

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: 0
	})
	leaveChannelId!: string

	@Column({
		type: DataType.TEXT,
		allowNull: false,
		defaultValue: `{user} left the server`
	})
	leaveMessage!: string

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: 0
	})
	joinChannelId!: string

	@Column({
		type: DataType.TEXT,
		allowNull: false,
		defaultValue: `{user}  **joined** - Invited **by** {inviter} ({invite.uses} invites)`
	})
	joinMessage!: string

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
		defaultValue: false
	})
	isKicked!: boolean

	@Column({
		type: DataType.DATE,
		allowNull: false,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
	})
	joinedAt!: Date

}
