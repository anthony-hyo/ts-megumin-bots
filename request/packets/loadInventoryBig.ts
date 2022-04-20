import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";
import ILoadInventoryBig from "../../interface/request/ILoadInventoryBig";

export default class LoadInventoryBig implements IRequest {

	public command: string = 'loadInventoryBig'

	handler(bot: Bot, data: ILoadInventoryBig): void {
		bot.handler.onInventoryLoad(data)

		bot.network.send('loadRetrieve', ['All'])
	}

}