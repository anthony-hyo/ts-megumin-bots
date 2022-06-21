import Bot from "../../../../Bot";
import IRequest from "../../../../../interface/IRequest";
import {IMarket} from "../../../../../interface/request/IMarket";

export default class LoadAuction implements IRequest {

	public command: string = 'loadAuction'

	handler(bot: Bot, data: IMarket): void {
		bot.handler.onMarketLoad(data)
	}

}