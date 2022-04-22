import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import {IMarket, Item} from "../../../interface/request/IMarket";
import logger from "../../../utility/Logger";
import Helper from "../../../utility/Helper";

export default class LoadAuction implements IRequest {

	public command: string = 'loadAuction'

	handler(bot: Bot, data: IMarket): void {
		bot.handler.onMarketLoad(data)
	}

}