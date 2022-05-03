import Default from "./Default";
import IMoveToArea from "../../interface/request/IMoveToArea";

export default class Fill extends Default {

	onJoin(data: IMoveToArea): void {
		if (this.bot.properties.intervalAttack != null) {
			clearInterval(this.bot.properties.intervalAttack)
		}

		if (this.bot.properties.intervalWalk != null) {
			clearInterval(this.bot.properties.intervalWalk)
		}

		this.bot.properties.intervalWalk = setInterval(() => {
			this.bot.room.freeWalk()
		}, 60000 * 2)
	}

}