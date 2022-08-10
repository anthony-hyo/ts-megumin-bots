import Default from "./Default";
import MainMulti from "../../MainMulti";
import ILoadInventoryBig from "../../interfaces/game/request/ILoadInventoryBig";

export default class Fill extends Default {

	onJoin(): void {
		this.walk()
	}

	onInventoryLoad(data: ILoadInventoryBig): void {
		super.onInventoryLoad(data)

		this.bot.joinMapRandom()
	}

	onSpawn(): void {
		this.walk()
	}

	onUserMessage(channel:string, username: string, message: string): void {
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
		this.bot.properties.intervalWalk = setInterval(() => this.bot.room.freeWalk(), 120000)
	}

}