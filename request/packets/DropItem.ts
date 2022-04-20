import Bot from "../../bot/Bot";
import IRequest from "../../interface/IRequest";

export default class DropItem implements IRequest {

	public command: string = 'dropItem'

	handler(bot: Bot, data: any): void {
		bot.handler.onDropItem()
	}

}