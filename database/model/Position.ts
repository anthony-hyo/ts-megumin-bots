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
	id: number

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: ``
	})
	map_name: string

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: ``
	})
	frame: string

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: ``
	})
	pad: string

	@Column({
		type: DataType.DOUBLE,
		allowNull: false,
		defaultValue: ``
	})
	x: string

	@Column({
		type: DataType.STRING(32),
		allowNull: false,
		defaultValue: ``
	})
	y: string

}
