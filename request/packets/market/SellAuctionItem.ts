import Bot from "../../../bot/Bot";
import IRequest from "../../../interface/IRequest";
import logger from "../../../utility/Logger";
import {ILoadRetrieve} from "../../../interface/request/ILoadRetrieve";
import Helper from "../../../utility/Helper";

export default class SellAuctionItem implements IRequest {

	public command: string = 'sellAuctionItem'

	handler(bot: Bot, data: ILoadRetrieve): void {
		console.log(data)
	}

}