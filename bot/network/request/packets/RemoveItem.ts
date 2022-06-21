import Bot from "../../../Bot";
import IRequest from "../../../../interface/IRequest";
import {IRemoveItem} from "../../../../interface/request/IRemoveItem";

export default class RemoveItem implements IRequest {

	public command: string = 'removeItem'

	handler(bot: Bot, data: IRemoveItem): void {
		bot.handler.onRemoveItem(data)
	}

}