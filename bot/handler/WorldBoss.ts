import Default from "./Default";
import axios, {AxiosResponse} from "axios";
import logger from "../../utility/Logger";
import Helper from "../../utility/Helper";
import IMoveToArea, {Monmap} from "../../interface/request/IMoveToArea";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";

export default class WorldBoss extends Default {

	private interval: NodeJS.Timeout | null = null

	onJoin(data: IMoveToArea): void {
		const arr: Array<string> = [
			'newbie',
			'outset',
			'yulgar',
			'avalon',
			'estarta',
		]

		if (data.strMapName == 'town') {
			this.bot.network.send('cmd', ['tfer', '', arr[Helper.randomIntegerInRange(0, arr.length - 1)]])
			return
		}

		if (data.monmap !== undefined && data.monmap.length > 0) {
			const monster: Monmap = data.monmap[0]

			setTimeout(() => {
				this.bot.network.send('moveToCell', [
					monster.strFrame,
					'Left'
				])

				if (this.interval != null) {
					clearInterval(this.interval)
				}

				this.interval = setInterval(() => {
					this.bot.network.send('gar', [1, `aa>m:${monster.MonMapID}`, "wvz"])
				}, 3000)
			}, 3000)
		} else if (this.interval != null) {
			clearInterval(this.interval)
		}

		this.bot.room.freeWalk()
	}

	onInventoryLoad(data: ILoadInventoryBig) {
		data.items.forEach(item => {
			switch (item.ItemID) {
				case 8236: //Boss Soul
				case 13397: //Boss Blood
				case 16222: //Limit Break +5
				case 14936: //Limit Break +1
					axios
						.get(`https://redhero.online/api/wiki/item/${item.ItemID}`)
						.then((response: AxiosResponse) => {
							const json: any = response.data

							if (json.markets != null && json.markets.length > 0) {
								const costs: Array<number> = []

								json.markets.forEach((market: { Coins: any; }) => costs.push(Number(market.Coins)))

								const cost: number = Helper.replaceLastDigit(Math.round(Helper.arrayAverage(costs)) * item.iQty)

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
					break;
			}
		})
	}

	onWorldBoss(data: any) {
		this.bot.properties.required_monsters.push(data.monName)

		this.bot.network.send('joinWorldBoss', [data.worldBossId])
	}

}