import Default from "./Default";
import IMoveToArea from "../../interface/request/IMoveToArea";
import Helper from "../../utility/Helper";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";
import logger from "../../utility/Logger";

export default class Fill extends Default {

	onJoin(data: IMoveToArea): void {
		/**
		 * Keep moving
		 */
		setInterval(() => this.bot.room.freeWalk(), 60000)
	}

	onInventoryLoad(data: ILoadInventoryBig) {
		logger.info(`[inventory] load "${this.bot.user.username}"`)

		const arr: Array<string> = [
			'market',
			'genjutsu',
			'forest',
			'forestcolored',
			'thravine',
			'outset',
			'thravine',
			//'town',
			'cyberspace',
			'fraskwinter',
			'newbie',
			'outset',
			'yulgar',
			'ainzvariant',
			'avalon',
			'estarta',
			'universe',
			'town',
			'purgatory'
		]

		this.bot.network.send('cmd', ['tfer', '', arr[Helper.randomIntegerInRange(0, arr.length - 1)]])
	}

}