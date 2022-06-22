import Bot from "../../../Bot";
import IRequest from "../../../../interfaces/game/IRequest";
import {IRemoveItem} from "../../../../interfaces/game/request/IRemoveItem";

export default class RemoveItem implements IRequest {

	public command: string = 'removeItem'

	handler(bot: Bot, data: IRemoveItem): void {
		bot.handler.onRemoveItem(data)
	}

}