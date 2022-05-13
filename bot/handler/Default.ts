import {IHandler} from "../../interface/IHandler";
import Bot from "../Bot";
import logger from "../../utility/Logger";
import Avatar from "../../data/Avatar";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";
import {IMarket} from "../../interface/request/IMarket";
import {IRemoveItem} from "../../interface/request/IRemoveItem";
import Helper from "../../utility/Helper";
import {IItem} from "../../interface/IItem";

export default class Default implements IHandler {

	private readonly _bot: Bot

	constructor(bot: Bot) {
		this._bot = bot
	}

	public get bot(): Bot {
		return this._bot;
	}

	onJoin(): void {
		logger.debug('default onJoin')
	}

	onInventoryLoad(data: ILoadInventoryBig): void {
		logger.debug('default onInventoryLoad')

		data.items.forEach((item: IItem) => this.bot.inventory.all.set(item.ItemID, item))

		this.bot.joinMapRandom()
	}

	onDropItem(item: IItem): void {
		logger.debug('default onDropItem')

		this.bot.inventory.add(item)
	}

	onRemoveItem(data: IRemoveItem): void {
		logger.debug('default onRemoveItem')

		this.bot.inventory.removeByCharItemID(data)
	}

	onDamageTaken(): void {
		logger.debug('default onDamageTaken')
	}

	onMarketLoad(data: IMarket): void {
		logger.debug('default onMarketLoad')
	}

	onMarketRetrieveLoad(data: IMarket): void {
		logger.debug('default onMarketRetrieveLoad')

		data.items.forEach((item: IItem) => {
			if (item.Player !== 'On Listing') {
				logger.debug(`[market] [${this.bot.user.username}] ${Helper.parseHTML(item.Player)} ${Helper.parseHTML(item.sName)}`)
				this.bot.network.send('retrieveAuctionItem', [item.AuctionID])
			}
		})
	}

	onDeath(): void {
		logger.debug('default onDeath')

		this.bot.properties.clearAllInterval()

		setTimeout(() => this.bot.network.send('resPlayerTimed'), 3000)
	}

	onSpawn(): void {
		logger.debug('default onSpawn')
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

	onUserMoveToCell(username: string, frame: string):void {
		logger.debug('default onUserMoveToCell')
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