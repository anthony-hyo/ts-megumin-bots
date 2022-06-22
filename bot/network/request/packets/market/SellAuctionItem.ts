import Bot from "../../../../Bot";
import IRequest from "../../../../../interfaces/game/IRequest";
import {ISellMarketItem} from "../../../../../interfaces/game/request/IMarket";
import logger from "../../../../../utility/Logger";

export default class SellAuctionItem implements IRequest {

	public command: string = 'sellAuctionItem'

	handler(bot: Bot, data: ISellMarketItem): void {
		logger.warn(`[market] [${bot.user.username}] sell ${data.strMessage === undefined ? `` : `"${data.strMessage}"`}`)
	}

}