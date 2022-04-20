import {IHandler} from "../../interface/IHandler";
import Bot from "../Bot";
import logger from "../../utility/Logger";
import Avatar from "../../data/Avatar";
import IMoveToArea from "../../interface/request/IMoveToArea";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";

export default class Default implements IHandler {

	private readonly _bot: Bot

	constructor(bot: Bot) {
		this._bot = bot
	}

	public get bot(): Bot {
		return this._bot;
	}

	onJoin(data: IMoveToArea): void {
		logger.debug('default onJoin')
	}

	onInventoryLoad(data: ILoadInventoryBig): void {
		logger.debug('default onInventoryLoad')
	}

	onDropItem(): void {
		logger.debug('default onDropItem')
	}

	onDamageTaken(): void {
		logger.debug('default onDamageTaken')
	}

	/*
		User
	 */
	onUserJoin(networkId: number): void {
		logger.debug('default onUserJoin')
	}

	onUserLeave(networkId: number): void {
		logger.debug('default onUserLeave')
	}

	/*
		Monster
	 */
	onWorldBoss(data: any): void {
		logger.debug('default onWorldBoss')
	}

	/*
		NPC
	 */
	//TODO:..

	/*
		Avatar
	 */
	onTargetDeath(avatar: Avatar): void {
		logger.debug('default onTargetDeath')
	}


}