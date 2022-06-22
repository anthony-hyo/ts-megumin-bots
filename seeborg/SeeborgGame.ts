import logger from "../utility/Logger"
import Bot from "../bot/Bot";
import Seeborg from "./Seeborg";

export default class SeeborgGame extends Seeborg {

	public onMessage(...args: any[]): void {
		const bot: Bot = args[0]
		const channel: string = args[1]
		const username: string = args[2]
		const message: string = args[3]

		try {
			if (this.shouldProcessMessage(channel, username)) {
				if (this.shouldComputeAnswer(channel, message.includes(username), message)) {
					setTimeout(() => {
						const reply: string | undefined = this.computeAnswer(message);

						if (reply === undefined || reply == message) {
							logger.error(`[Seeborg] replyWithAnswer response was undefined or invalid`);
							return
						}

						bot.network.send('message', [reply, channel])
					}, Math.floor((Math.floor(Math.random() * 15) + 1) * 1000))
				}
				if (this.shouldLearn(channel, message)) {
					this.learn(message);
				}
			}
		} catch (error) {
			logger.error(`[Seeborg] [${bot.user.username}] onMessage ${error}`)
		}
	}

}