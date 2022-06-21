import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";
import Fill from "./Fill";

export default class Market extends Fill {

	onInventoryLoad(data: ILoadInventoryBig) {
		super.onInventoryLoad(data)

		this.bot.network.send('loadRetrieve', ['All'])
		
		//this.bot.inventory.all.forEach((item: IItem): void => this.bot.marketSell(item))
	}

	// onMarketLoad(data: IMarket): void {
	// 	data.items.forEach((item: IItem) => {
	// 		switch (item.ItemID) {
	// 			case 13397: //Boss Blood
	// 				this.bot.bot.network.send("buyAuctionItem", [item.AuctionID])
	// 				break;
	// 		}
	// 	})
	// }

}