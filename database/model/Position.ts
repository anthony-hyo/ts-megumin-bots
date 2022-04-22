import {Column, DataType, Model, Table} from 'sequelize-typescript'

@Table({
	tableName: 'positions',
	indexes: [
		{
			name: "PRIMARY",
			unique: true,
			using: "BTREE",
			fields: [
				{name: "id"},
			]
		},
		{
			name: "id",
			unique: true,
			using: "BTREE",
			fields: [
				{name: "id"},
			]
		},
		{
			name: "frame_pad_x_y",
			unique: true,
			using: "BTREE",
			fields: [
				{name: "frame"},
				{name: "pad"},
				{name: "x"},
				{name: "y"},
			]
		},
	]
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
