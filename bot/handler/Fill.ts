import Default from "./Default";
import IMoveToArea from "../../interface/request/IMoveToArea";

export default class Fill extends Default {

	onJoin(data: IMoveToArea): void {
		/**
		 * Keep moving
		 */
		setInterval(() => this.bot.room.freeWalk(), 30000)
	}

}