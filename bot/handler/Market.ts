import Default from "./Default";
import axios, {AxiosResponse} from "axios";
import logger from "../../utility/Logger";
import Helper from "../../utility/Helper";
import IMoveToArea from "../../interface/request/IMoveToArea";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";
import {IMarket, Item} from "../../interface/request/IMarket";

export default class Market extends Default {

	onJoin(data: IMoveToArea): void {
		if (this.bot.properties.intervalWalk != null) {
			clearInterval(this.bot.properties.intervalWalk)
		}

		if (data.strMapName != 'town') {
			this.bot.network.send('cmd', ['tfer', '', 'town'])
			return
		}

		this.bot.properties.intervalWalk = setInterval(() => {
			this.bot.room.freeWalk()
		}, 60000 * 5)
	}

	onInventoryLoad(data: ILoadInventoryBig) {
		data.items.forEach(item => {
			switch (item.ItemID) {
				case 8236: //Boss Soul
					if (item.iQty > 50) {
						axios
							.get(`https://redhero.online/api/wiki/item/${item.ItemID}`)
							.then((response: AxiosResponse) => {
								const json: any = response.data

								if (json.markets != null && json.markets.length > 0 && item.iQty > 50) {
									const costs: Array<number> = []

									json.markets.forEach((market: { Coins: any; }) => costs.push(Number(market.Coins)))

									const cost: number = Helper.replaceLastDigit(Helper.decreaseByPercentage(50, Math.round(Helper.arrayAverage(costs)) * item.iQty))

									logger.info(`[market] selling "${Helper.parseHTML(item.sName)}" for "${cost}" Coins`)

									this.bot.network.send("sellAuctionItem", [
										item.ItemID,
										item.CharItemID,
										item.iQty,
										cost,
										0
									])
								}
							})
							.catch(console.error)
					}
					break;
			}
		})

		this.bot.network.send('loadAuction', ['All'])
	}

	onMarketLoad(data: IMarket): void {
		data.items.forEach((item: Item) => {
			switch (item.ItemID) {
				case 13397: //Boss Blood
					this.bot.network.send("buyAuctionItem", [ item.AuctionID ])
					break;
			}
		})
	}

}