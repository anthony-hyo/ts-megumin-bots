import Bot from "../../../Bot";
import IRequest from "../../../../interfaces/game/IRequest";
import logger from "../../../../utility/Logger";

export default class LoginResponse implements IRequest {

	public command: string = 'loginResponse'

	handler(bot: Bot, data: {
		success: boolean
		networkId: number
		message: string
	}): void {
		if (data.success) {
			bot.network.id = data.networkId

			bot.singleton.data.bots.set(bot.network.id, bot)

			bot.network.send('firstJoin')

			setTimeout(() => bot.network.send('retrieveInventory', [bot.network.id]), 1500)
		} else {
			logger.error(`login failed to ${bot.user.username} : ${data.message}`)
		}
	}

}