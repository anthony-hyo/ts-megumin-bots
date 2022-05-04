import Default from "./Default";
import IMoveToArea from "../../interface/request/IMoveToArea";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";
import {IItem} from "../../interface/IItem";

export default class Market extends Default {

export default class Market extends Fill {

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