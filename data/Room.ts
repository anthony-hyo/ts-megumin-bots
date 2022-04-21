import Position from "../database/model/Position";
import {Sequelize} from "sequelize";
import Bot from "../bot/Bot";
import Helper from "../utility/Helper";
import Avatar from "./Avatar";

export default class Room {

	private readonly bot: Bot
	private readonly _id: number = -1
	private readonly _name: string = 'none'
	private readonly _fullName: string = 'none'

	constructor(bot: Bot, id: number, fullName: string, name: string) {
		this.bot = bot
		this._id = id
		this._name = name
		this._fullName = fullName
	}

	public get id(): number {
		return this._id;
	}

	public get name(): string {
		return this._name;
	}

	public get fullName(): string {
		return this._fullName;
	}

	private _players: Map<Number, Avatar> = new Map<Number, Avatar>()

	public get players(): Map<Number, Avatar> {
		return this._players;
	}

	/**
	 * Find position to move
	 */
	public freeWalk(): void {
		Position
			.findOne({
				where: {
					map_name: this.name
				},
				order: Sequelize.literal('random()')
			})
			.then((position: Position | null) => {
				if (position) {
					this.bot.network.send('moveToCell', [
						position.frame,
						position.pad
					])

					setTimeout(() => this.bot.network.send("mv", [position.x, position.y, 10]), Helper.randomIntegerInRange(2000, 5000))
				}
			})
			.catch(console.error)
	}

}