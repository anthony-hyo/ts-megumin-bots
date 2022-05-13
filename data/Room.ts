import Position from "../database/model/Position";
import {Sequelize} from "sequelize";
import Bot from "../bot/Bot";
import Avatar from "./Avatar";
import logger from "../utility/Logger";
import IMoveToArea from "../interface/request/IMoveToArea";
import MainMulti from "../MainMulti";

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

	private _players: Map<Number, Avatar> = new Map<Number, Avatar>()

	private get players(): Map<Number, Avatar> {
		return this._players;
	}

	private _monsters: Map<Number, Avatar> = new Map<Number, Avatar>()

	public get monsters(): Map<Number, Avatar> {
		return this._monsters;
	}

	private _npcs: Map<Number, Avatar> = new Map<Number, Avatar>()

	public get npcs(): Map<Number, Avatar> {
		return this._npcs;
	}

	public static addPosition(name: string, frame: string, pad: string, x: number, y: number, speed: number, server: string) {
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
					speed: speed,
					server: server
				},
				defaults: {
					name: name,
					frame: frame,
					pad: pad,
					x: x,
					y: y,
					speed: speed,
					server: server
				}
			})
			.catch((error: any) => {
				if (error.parent.code === 'SQLITE_BUSY') {
					logger.error(`[SQLITE_BUSY] trying again in 3s`)
					setTimeout(() => Room.addPosition(name, frame, pad, x, y, speed, server), 3000)
				}
			})
	}

	public addPlayer(networkId: number, username: string): void {
		this.players.set(networkId, new Avatar(networkId, username, MainMulti.singletons(this.bot.user.server).bots.has(networkId)))
	}

	public removePlayer(networkId: number): void {
		this.players.delete(networkId)
	}

	public getPlayerByUsername(username: string): null | Avatar {
		for (const target of this.players.values()) {
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

	public isBot(username: string): boolean {
		for (const target of MainMulti.singletons(this.bot.user.server).bots.values()) {
			if (target.user.username.toLowerCase() === username.toLowerCase()) {
				return true
			}
		}
		return false
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
		Position
			.findOne({
				where: {
					name: this.data.strMapName,
					server: this.bot.user.server
				},
				order: Sequelize.literal('rand()')
			})
			.then((position: Position | null) => {
				if (position) {
					this.moveToCell(position.frame, position.pad)
					this.bot.network.send("mv", [position.x, position.y, position.speed])
				}
			})
			.catch(e => console.error('error 3', e))
	}

}