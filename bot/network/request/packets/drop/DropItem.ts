import Bot from "../../../../Bot";
import IRequest from "../../../../../interfaces/game/IRequest";
import {IDropItem} from "../../../../../interfaces/game/request/IDrop";
import {IItem} from "../../../../../interfaces/game/IItem";

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