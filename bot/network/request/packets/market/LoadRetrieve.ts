import Bot from "../../../../Bot";
import IRequest from "../../../../../interfaces/game/IRequest";
import {IMarket} from "../../../../../interfaces/game/request/IMarket";

export default class LoadRetrieve implements IRequest {

	public command: string = 'loadRetrieve'

	handler(bot: Bot, data: IMarket): void {
		bot.handler.onMarketRetrieveLoad(data)
	}

}