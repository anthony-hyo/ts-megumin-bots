import {Column, DataType, Model, Table} from 'sequelize-typescript'

@Table({
	tableName: 'game_users',
	indexes: [
		{
			name: "PRIMARY",
			unique: true,
			using: "BTREE",
			fields: [
				{name: "id"},
			]
		}
	]
})
export default class GameUser extends Model {

	@Column({
		type: DataType.INTEGER,
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	})
	id!: number

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
	password!: string

	@Column({
		type: DataType.STRING(64),
		allowNull: false,
		defaultValue: `WorldBoss`
	})
	handler!: string

	@Column({
		type: DataType.ENUM('RedHero', 'RedAQ'),
		allowNull: false,
		defaultValue: `RedHero`
	})
	server!: 'RedHero' | 'RedAQ'

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
		defaultValue: 0
	})
	isUnique!: string

}
