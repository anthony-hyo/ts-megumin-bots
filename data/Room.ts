import Position from "../database/model/Position";
import {Sequelize} from "sequelize";
import logger from "../utility/Logger";
import Bot from "../bot/Bot";
import Helper from "../utility/Helper";
import Avatar from "./Avatar";

export default class Room {

	private readonly bot: Bot

	constructor(bot: Bot) {
		this.bot = bot
	}

	private _id: number

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}

	private _name: string

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}

	private _players: Set<Avatar> = new Set<Avatar>()

    public get players(): Set<Avatar> {
		return this._players;
	}

	/**
	 * Find position to move
	 */
	public freeWalk() {
		Position
			.findOne({
				where: {
					map_name: this.name
				},
				order: Sequelize.literal('random()')
			})
			.then((position: Position) => {
				this.bot.network.send('moveToCell', [
					position.frame,
					position.pad
				])
				setTimeout(() => this.bot.network.send("mv", [position.x, position.y, 10]), Helper.randomIntegerInRange(2000, 5000))
			})
			.catch(logger.error)
	}

}