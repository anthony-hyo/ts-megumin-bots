import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import {IMarket} from "../../../interface/request/IMarket";

export default class LoadRetrieve implements IRequest {

	public command: string = 'loadRetrieve'

	handler(bot: Bot, data: IMarket): void {
		bot.handler.onMarketRetrieveLoad(data)
	}

}