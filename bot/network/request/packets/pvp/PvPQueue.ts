import Bot from "../../../../Bot";
import IRequest from "../../../../../interfaces/game/IRequest";
import {IPvPQueue} from "../../../../../interfaces/game/request/IPvPQueue";
import logger from "../../../../../utility/Logger";

export default class PvPInvite implements IRequest {

	public command: string = 'PVPQ'

	handler(bot: Bot, data: IPvPQueue): void {
		if (data.bitSuccess) {
			logger.debug(`[pvp] [${bot.user.username}] war zone started ${data.warzone}`)
		} else {
			logger.warn(`[pvp] [${bot.user.username}] removed from war zone queue`)
		}
	}

}