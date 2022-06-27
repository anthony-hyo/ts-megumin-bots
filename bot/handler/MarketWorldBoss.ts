import ILoadInventoryBig from "../../interfaces/game/request/ILoadInventoryBig";
import {IItem} from "../../interfaces/game/IItem";
import WorldBoss from "./monster/WorldBoss";

export default class MarketWorldBoss extends WorldBoss {

	private intervalMarket: NodeJS.Timer | null = null

	onInventoryLoad(data: ILoadInventoryBig): void {
		super.onInventoryLoad(data)

		this.bot.network.send('loadRetrieve', ['All'])
		
		this.bot.inventory.all.forEach((item: IItem): void => this.bot.marketSell(item))

		this.intervalMarket = setInterval(() => {
			this.bot.inventory.all.forEach((item: IItem): void => this.bot.marketSell(item))
		}, 600000)
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

}