import Default from "./Default";
import IMoveToArea from "../../interface/request/IMoveToArea";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";
import {IItem} from "../../interface/IItem";

export default class Market extends Default {

	onJoin(data: IMoveToArea): void {
		if (this.bot.properties.intervalAttack != null) {
			clearInterval(this.bot.properties.intervalAttack)
		}

		if (this.bot.properties.intervalWalk != null) {
			clearInterval(this.bot.properties.intervalWalk)
		}

		this.bot.properties.intervalWalk = setInterval(() => {
			this.bot.room.freeWalk()
		}, 60000 * 5)
	}

	onInventoryLoad(data: ILoadInventoryBig) {
		super.onInventoryLoad(data)
		
		this.bot.inventory.all.forEach((item: IItem): void => this.bot.marketSell(item))
	}

	// onMarketLoad(data: IMarket): void {
	// 	data.items.forEach((item: IItem) => {
	// 		switch (item.ItemID) {
	// 			case 13397: //Boss Blood
	// 				this.bot.network.send("buyAuctionItem", [item.AuctionID])
	// 				break;
	// 		}
	// 	})
	// }

}