import Bot from "../../../../Bot";
import IRequest from "../../../../../interface/IRequest";
import {IMarket} from "../../../../../interface/request/IMarket";
import logger from "../../../../../utility/Logger";
import Helper from "../../../../../utility/Helper";

export default class RetrieveAuctionItem implements IRequest {

	public command: string = 'retrieveAuctionItem'

	handler(bot: Bot, data: IMarket): void {
		if (data.bitSuccess) {
			logger.debug(`[market] [${bot.user.username}] retrieved ${Helper.parseHTML(data.item.sName)}`)
		} else {
			logger.warn(`[market] [${bot.user.username}] retrieved error ${data.strMessage}`)
		}
	}

}