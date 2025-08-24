import {IItem} from "../interfaces/game/IItem";
import Bot from "./Bot";

export default class Properties {

	private readonly bot: Bot

	public token!: string

	private _intervalAttack: NodeJS.Timeout | null = null
	private _intervalWalk: NodeJS.Timer | null = null

	public droppedItems: Map<number, IItem> = new Map<number, IItem>()

	public wasOnWorldBoss: boolean = false
	public isOnWarZoneQueue: boolean = false
	public isLoad: boolean = false

	public constructor(bot: Bot) {
		this.bot = bot
	}

	public set intervalAttack(value: NodeJS.Timeout | null) {
		this.bot.properties.clearAttack()
		this._intervalAttack = value;
	}

	public set intervalWalk(value: NodeJS.Timer | null) {
		this.bot.properties.clearWalk()
		this._intervalWalk = value;
	}

	public clearAttack(): void {
		if (this._intervalAttack != null) {
			clearInterval(this._intervalAttack)
		}
	}

	public clearWalk(): void {
		if (this._intervalWalk != null) {
			clearInterval(this._intervalWalk)
		}
	}

	public clearAllInterval(): void {
		this.clearAttack()
		this.clearWalk()
	}

}