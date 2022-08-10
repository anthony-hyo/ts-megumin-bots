import ILoadInventoryBig from "../../../interfaces/game/request/ILoadInventoryBig";
import {IItem} from "../../../interfaces/game/IItem";
import Helper from "../../../utility/Helper";
import logger from "../../../utility/Logger";
import Default from "../Default";
import Bot from "../../Bot";

export default class Market extends Default {

	private intervalMarket: NodeJS.Timer | null = null

	private readonly frames: string[]
	private readonly max: number

	constructor(bot: Bot) {
		super(bot);

		if (bot.user.server === 'RedHero') {
			this.frames = [
				'RightWay',
				'LeftWay',
				'CentralWay',
				'RigthPath',
				'LeftPath',
				'CentralPath',
				'Enter',
			]
			this.max = 35
		} else {
			this.frames = [
				'Enter',
				'Area2',
				'Area3',
			]
			this.max = 15
		}
	}

	onJoin(): void {
		const frame = this.frames[Helper.randomIntegerInRange(0, this.frames.length - 1)];

		if (this.bot.room.data.strMapName !== 'town') {
			this.bot.joinMap('town', frame)
			return
		}

		if (this.bot.room.data.strMapName === 'town' && this.bot.room.bots.length > this.max) {
			this.bot.joinMap('town-' + this.bot.room.data.areaName.split('-')[1] + 1, frame)
			return
		}

		if (this.bot.room.data.strMapName === 'town') {
			this.bot.room.moveToCell(frame, 'Left')
		}

		this.bot.room.freeWalkFrame()

		this.bot.properties.intervalWalk = setInterval(() => this.bot.room.freeWalkFrame(), 120000)

		this.bot.network.send('loadRetrieve', [
			'All',
			this.bot.user.username
		])

		this.intervalMarket = setInterval(() => {
			this.bot.inventory.all.forEach((item: IItem): void => this.marketSell(item))
		}, 600000)

		this.bot.network.send('vending', [ true ])
	}

	onInventoryLoad(data: ILoadInventoryBig): void {
		super.onInventoryLoad(data)

		this.bot.inventory.all.forEach((item: IItem): void => this.marketSell(item))
	}

	/*onMarketLoad(data: IMarket): void {
		data.items.forEach((item: IItem) => {
			switch (item.ItemID) {
				case 13397:
					this.bot.network.send("buyAuctionItem", [item.AuctionID])
					break;
			}
		})
	}*/

	onDisconnect(): void {
		if (this.intervalMarket != null) {
			clearInterval(this.intervalMarket)
		}
		super.onDisconnect()
	}

	private marketSell(item: IItem): void {
		const averageCost: number | undefined = this.bot.singleton.data.market_items.get(item.ItemID)

		if (averageCost) {
			const quantity: number = Math.min(5, item.iQty)

			const cost: number = Helper.replaceLastDigit(averageCost * quantity)

			setTimeout(() => {
				logger.info(`[market] [${this.bot.user.username}] selling "${Helper.parseHTML(item.sName)}" for "${cost}" Coins`)

				this.bot.network.send("sellAuctionItem", [
					item.ItemID,
					item.CharItemID,
					quantity,
					cost,
					0,
					this.bot.user.username
				])
			}, Helper.randomIntegerInRange(1000, 2000))
		}
	}

}