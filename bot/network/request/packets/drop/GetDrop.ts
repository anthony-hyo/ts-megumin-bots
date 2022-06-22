import Bot from "../../../../Bot";
import IRequest from "../../../../../interfaces/game/IRequest";
import {IGetDrop} from "../../../../../interfaces/game/request/IDrop";
import logger from "../../../../../utility/Logger";
import {IItem} from "../../../../../interfaces/game/IItem";

export default class GetDrop implements IRequest {

	public command: string = 'getDrop'

	handler(bot: Bot, data: IGetDrop): void {
		if (data.bBank) {
			logger.warn(`[getDrop] [${bot.user.username}] could not accept drop ${data.ItemID} in bank`)
		} else if (data.bSuccess) {
			logger.debug(`[getDrop] [${bot.user.username}] accepted drop ${data.ItemID}`)

			const item: IItem | undefined = bot.properties.droppedItems.get(data.ItemID)

			if (item) {
				bot.handler.onDropItem(item)
			} else {
				logger.warn(`[getDrop] [${bot.user.username}] drop undefined ${data.ItemID}`)
			}
		} else {
			logger.warn(`[getDrop] [${bot.user.username}] could not accept drop ${data.ItemID}`)
			bot.properties.droppedItems.delete(data.ItemID)
		}
	}

}