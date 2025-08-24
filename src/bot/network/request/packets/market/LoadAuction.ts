import Bot from "../../../../Bot";
import IRequest from "../../../../../interfaces/game/IRequest";
import {IMarket} from "../../../../../interfaces/game/request/IMarket";

export default class LoadAuction implements IRequest {

	public command: string = 'loadAuction'

	handler(bot: Bot, data: IMarket): void {
		bot.handler.onMarketLoad(data)
	}

}