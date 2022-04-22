import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import {IGetDrop} from "../../../interface/request/IDrop";
import logger from "../../../utility/Logger";

export default class GetDrop implements IRequest {

	public command: string = 'getDrop'

	handler(bot: Bot, data: IGetDrop): void {
		if (data.bSuccess) {
			logger.info(`[${bot.user.username}] [market] accepted drop "${data.ItemID}"`)
		} else {
			logger.error(`[${bot.user.username}] [market] could not accept drop "${data.ItemID}" ${data.bBank ? `"in bank"` : ``}`)
		}
	}

}