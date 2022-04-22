import {Column, DataType, Model, Table} from 'sequelize-typescript'

@Table({
	tableName: 'positions'
})
export default class Position extends Model {

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
	name!: string

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: ``
	})
	frame!: string

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: 0
	})
	pad!: string

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		defaultValue: 0
	})
	x!: number

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		defaultValue: 0
	})
	y!: number

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		defaultValue: 1
	})
	speed!: string

}
