import Default from "./Default";

export default class Fill extends Default {

	onJoin(): void {
		this.walk()
	}

	onSpawn(): void {
		this.walk()
	}

	private walk(): void {
		this.bot.properties.intervalWalk = setInterval(() => this.bot.room.freeWalk(), 60000 * 2)
	}

}