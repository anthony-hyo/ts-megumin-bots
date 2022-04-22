import Default from "./Default";
import IMoveToArea from "../../interface/request/IMoveToArea";
import Helper from "../../utility/Helper";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";
import logger from "../../utility/Logger";

export default class Fill extends Default {

	onJoin(data: IMoveToArea): void {
		if (this.bot.properties.intervalWalk != null) {
			clearInterval(this.bot.properties.intervalWalk)
		}

		this.bot.properties.intervalWalk = setInterval(() => {
			this.bot.room.freeWalk()
		}, 60000 * 5)
	}

	onInventoryLoad(data: ILoadInventoryBig) {
		logger.info(`[inventory] load "${this.bot.user.username}"`)

		const arr: Array<string> = [
			'newbie',
			'outset',
			'yulgar',
			'avalon',
			'estarta',
			'ivillis',
		]

		this.bot.network.send('cmd', ['tfer', '', arr[Helper.randomIntegerInRange(0, arr.length - 1)]])
	}

}