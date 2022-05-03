import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import logger from "../../../utility/Logger";
import {IMarket} from "../../../interface/request/IMarket";
import Helper from "../../../utility/Helper";

export default class RetrieveAuctionItem implements IRequest {

	public command: string = 'retrieveAuctionItem'

	handler(bot: Bot, data: IMarket): void {
		if (data.bitSuccess) {
			logger.info(`[market] [${bot.user.username}] retrieved ${Helper.parseHTML(data.item.sName)}`)
		} else {
			logger.info(`[market] [${bot.user.username}] retrieved error ${data.strMessage}`)
		}
	}

}