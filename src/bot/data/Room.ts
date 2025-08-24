import GamePosition from "../../database/model/GamePosition";
import {Sequelize} from "sequelize";
import Bot from "../Bot";
import Avatar from "./Avatar";
import IMoveToArea from "../../interfaces/game/request/IMoveToArea";
import MainMulti from "../../MainMulti";
import logger from "../../utility/Logger";

export default class Room {

	private readonly bot: Bot

	constructor(bot: Bot, data: IMoveToArea) {
		this.bot = bot
		this._data = data
	}

	private _data: IMoveToArea;

	public get data(): IMoveToArea {
		return this._data;
	}

	public set data(value: IMoveToArea) {
		this._data = value;
	}

	private _frame: string = ''

	public get frame(): string {
		return this._frame;
	}

	public set frame(value: string) {
		this._frame = value;
	}

	private _players: Map<number, Avatar> = new Map<number, Avatar>()

	public get players(): Map<number, Avatar> {
		return this._players;
	}

	public get bots(): Avatar[] {
		return Array.from(this._players.values()).filter((avatar: Avatar) => avatar.isBot)
	}

	private _monsters: Map<number, Avatar> = new Map<number, Avatar>()

	public get monsters(): Map<number, Avatar> {
		return this._monsters;
	}

	private _npcs: Map<number, Avatar> = new Map<number, Avatar>()

	public get npcs(): Map<number, Avatar> {
		return this._npcs;
	}

	public static addPosition(name: string, frame: string, pad: string, x: number, y: number, speed: number, server: string): void {
		if (x >= 0 && y >= 0 && y <= 550 && x <= 960) {
			MainMulti.queue_positions.push({
				name: name,
				frame: frame,
				pad: pad,
				x: x,
				y: y,
				speed: speed,
				server: server
			})
		}
	}

	public addPlayer(networkId: number, username: string): void {
		this._players.set(networkId, new Avatar(networkId, username, this.bot.singleton.data.bots.has(networkId)))
	}

	public removePlayer(networkId: number): void {
		this._players.delete(networkId)
	}

	public getPlayerByUsername(username: string): null | Avatar {
		for (const target of this._players.values()) {
			if (target.username.toLowerCase() === username.toLowerCase()) {
				return target
			}
		}
		return null
	}

	public getMonsterByMonsterMapId(npcMapId: number): null | Avatar {
		for (const target of this.monsters.values()) {
			if (target.id === npcMapId) {
				return target
			}
		}
		return null
	}

	public getNpcByNpcMapId(monsterMapId: number): null | Avatar {
		for (const target of this.npcs.values()) {
			if (target.id === monsterMapId) {
				return target
			}
		}
		return null
	}

	public moveToCell(frame: string, pad: string) {
		this.frame = frame
		this.bot.network.send('moveToCell', [
			frame,
			pad
		])
	}

	/**
	 * Find position to move
	 */
	public freeWalk(): void {
		GamePosition
			.findOne({
				where: {
					name: this.data.strMapName,
					server: this.bot.user.server
				},
				order: Sequelize.literal('rand()')
			})
			.then((position: GamePosition | null) => {
				if (position) {
					this.moveToCell(position.frame, position.pad)
					this.bot.network.send("mv", [position.x, position.y, position.speed])
				}
			})
			.catch(error => logger.error(`[Room] freeWalk ${error}`))
	}

	/**
	 * Find frame position to move
	 */
	public freeWalkFrame(): void {
		GamePosition
			.findOne({
				where: {
					name: this.data.strMapName,
					server: this.bot.user.server,
					frame: this._frame
				},
				order: Sequelize.literal('rand()')
			})
			.then((position: GamePosition | null) => {
				if (position) {
					this.bot.network.send("mv", [position.x, position.y, position.speed])
				}
			})
			.catch(error => logger.error(`[Room] freeWalkFrame ${error}`))
	}

}