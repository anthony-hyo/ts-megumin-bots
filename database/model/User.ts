import {Column, DataType, Model, Table} from 'sequelize-typescript'

@Table({
	tableName: 'users',
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
	]
})
export default class User extends Model {

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

	// @Column({
	//     type: DataType.STRING(64),
	//     allowNull: false,
	//     defaultValue: ``
	// })
	// handler: string

}
