import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import {IDropItem, Item} from "../../../interface/request/IDrop";

export default class DropItem implements IRequest {

	public command: string = 'dropItem'

	handler(bot: Bot, data: IDropItem): void {
		for (const itemsKey in data.items) {
			const item: Item = data.items[itemsKey]
			bot.network.send('getDrop', [ item.ItemID ])
		}
	}

}