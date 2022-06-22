import Default from "./Default";
import MainMulti from "../../MainMulti";

export default class Fill extends Default {

	onJoin(): void {
		this.walk()
	}

	onSpawn(): void {
		this.walk()
	}

	onUserMessage(channel:string, username: string, message: string) {
		switch (channel) {
			case 'world':
				MainMulti.singleton.seeborgGame.onMessage(this.bot, 'world', username, message)
				break;
			case 'trade':
				MainMulti.singleton.seeborgGame.onMessage(this.bot, 'trade', username, message)
				break;
			case 'crosschat':
				MainMulti.singleton.seeborgGame.onMessage(this.bot, 'crosschat', username, message)
				break;
			default:
				MainMulti.singleton.seeborgGame.onMessage(this.bot, 'zone', username, message)
				break;
		}
	}

	private walk(): void {
		this.bot.properties.intervalWalk = setInterval(() => this.bot.room.freeWalk(), 60000 * 2)
	}

}