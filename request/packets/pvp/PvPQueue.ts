import IRequest from "../../../interface/IRequest";
import Bot from "../../../bot/Bot";
import logger from "../../../utility/Logger";
import {IPvPQueue} from "../../../interface/request/IPvPQueue";

export default class PvPInvite implements IRequest {

	public command: string = 'PVPQ'

	handler(bot: Bot, data: IPvPQueue): void {
		if (data.bitSuccess) {
			logger.info(`[pvp] [${bot.user.username}] war zone started ${data.warzone}`)
		} else {
			logger.warn(`[pvp] [${bot.user.username}] removed from war zone queue`)
		}
	}

}