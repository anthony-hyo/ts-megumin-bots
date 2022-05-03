import Position from "../database/model/Position";
import {Sequelize} from "sequelize";
import Bot from "../bot/Bot";
import Helper from "../utility/Helper";
import Avatar from "./Avatar";
import logger from "../utility/Logger";
import Main from "../Main";

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

	public static addPosition(name: string, frame: string, pad: string, x: number, y: number, speed: number) {
		// noinspection JSIgnoredPromiseFromCall
		/**
		 * Save players positions to be used by the bots
		 */
		Position
			.findOrCreate({
				where: {
					name: name,
					frame: frame,
					pad: pad,
					x: x,
					y: y,
					speed: speed
				},
				defaults: {
					name: name,
					frame: frame,
					pad: pad,
					x: x,
					y: y,
					speed: speed
				}
			})
			.catch((error: any) => {
				if (error.parent.code === 'SQLITE_BUSY') {
					logger.error(`[SQLITE_BUSY] trying again in 3s`)
					setTimeout(() => Room.addPosition(name, frame, pad, x, y, speed), 3000)
				}
			})
	}

	public hasPlayer(username: string): boolean {
		for (const target of this.players.values()) {
			if (target.username.toLowerCase() === username.toLowerCase()) {
				return true
			}
		}
		return false
	}

	public isBot(username: string): boolean {
		for (const target of Main.singleton.bots.values()) {
			if (target.user.username.toLowerCase() === username.toLowerCase()) {
				return true
			}
		}
		return false
	}

	/**
	 * Find position to move
	 */
	public freeWalk(): void {
		Position
			.findOne({
				where: {
					name: this.name
				},
				order: Sequelize.literal('rand()')
			})
			.then((position: Position | null) => {
				if (position) {
					this.bot.network.send('moveToCell', [
						position.frame,
						position.pad
					])

					setTimeout(() => this.bot.network.send("mv", [position.x, position.y, position.speed]), Helper.randomIntegerInRange(2000, 5000))
				}
			})
			.catch(e => console.error('error 3', e))
	}

}