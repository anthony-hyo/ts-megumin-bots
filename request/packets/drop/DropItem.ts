import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import {IDropItem} from "../../../interface/request/IDrop";
import {IItem} from "../../../interface/IItem";

export default class DropItem implements IRequest {

	public command: string = 'dropItem'

	handler(bot: Bot, data: IDropItem): void {
		for (const itemsKey in data.items) {
			const item: IItem = data.items[itemsKey]

			bot.properties.droppedItems.set(item.ItemID, item)

			bot.network.send('getDrop', [ item.ItemID ])
		}
	}

}